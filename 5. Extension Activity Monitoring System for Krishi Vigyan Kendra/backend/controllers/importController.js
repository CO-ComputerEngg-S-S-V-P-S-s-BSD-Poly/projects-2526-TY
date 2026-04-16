const DataEntry = require('../models/DataEntry');
const User = require('../models/User');
const Discipline = require('../models/Discipline');
const YearLock = require('../models/YearLock');

// @desc    Bulk import data entry records from Excel
// @route   POST /api/import/bulk-data-entry
// @access  Private
const bulkImportDataEntry = async (req, res) => {
  try {
    const { records, disciplineFilter } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No records provided for import' });
    }

    // Fetch all approved system users, disciplines, and locked years for contact matching
    const isAdmin = req.user && req.user.role === 'admin';
    const [systemUsers, allDisciplines, lockedYearDocs] = await Promise.all([
      User.find({ status: 'approved' }).lean(),
      Discipline.find({ isDeleted: false }).lean(),
      isAdmin ? Promise.resolve([]) : YearLock.find({ isLocked: true }).lean()
    ]);
    const lockedYearsSet = new Set(lockedYearDocs.map(l => l.year));

    const disciplineFilterLower = disciplineFilter ? String(disciplineFilter).toLowerCase().trim() : null;

    const cleanStr = (str) => (str || '').toLowerCase().trim();
    const normalizeName = (str) => {
      // lower‑case, remove honorifics and non‑letters like spaces, dots, commas, etc.
      return cleanStr(str)
        .replace(/\b(dr|prof|mr|ms|mrs|shri|shree|sh|smt|kumari|shrimati|adv|er)\b\.?/g, '') // drop common prefixes
        .replace(/[^a-z]/g, ''); // keep only letters
    };

    const levenshtein = (a, b) => {
      const s = a || '';
      const t = b || '';
      if (s === t) return 0;
      if (!s) return t.length;
      if (!t) return s.length;
      const rows = s.length + 1;
      const cols = t.length + 1;
      const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
      for (let i = 0; i < rows; i++) dp[i][0] = i;
      for (let j = 0; j < cols; j++) dp[0][j] = j;
      for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
          const cost = s[i - 1] === t[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }
      return dp[rows - 1][cols - 1];
    };

    // Helper to find a matching system user based on name or email context
    const findMatchingUser = (excelName, excelEmail) => {
      if (!excelName && !excelEmail) return null;

      const fullExcelName = cleanStr(excelName);
      const fullExcelEmail = cleanStr(excelEmail);
      const normExcelName = normalizeName(excelName || '');
      
      // Extract Excel name parts for surname matching
      const cleanExcel = fullExcelName.replace(/\b(dr|prof|mr|ms|mrs|shri|shree|sh|smt|kumari|shrimati|adv|er)\b\.?/g, '').trim();
      const excelParts = cleanExcel.split(/[\s.]+/).filter(p => p.length > 0);
      const excelFirst = excelParts[0] || '';
      const excelLast = excelParts[excelParts.length - 1] || '';

      let bestMatch = null;
      let highestScore = 0;

      for (const user of systemUsers) {
        let score = 0;
        const fullUserName = cleanStr(user.name);
        const fullUserEmail = cleanStr(user.email);
        const userEmailPrefix = fullUserEmail.split('@')[0];
        const normUserName = normalizeName(user.name || '');

        // 1. EXACT MATCHES (High Confidence)
        if (fullExcelEmail && fullExcelEmail === fullUserEmail) {
          score = 100;
        } else if (fullExcelName && fullExcelName === fullUserName) {
          score = 98;
        } else if (normExcelName && normExcelName === normUserName) {
          score = 95;
        }

        // 2. NAME-BASED MATCHING (Surname is mandatory for confidence)
        if (score < 95 && excelLast && excelLast.length >= 3) {
          const userClean = fullUserName.replace(/\b(dr|prof|mr|ms|mrs|shri|shree|sh|smt|kumari|shrimati|adv|er)\b\.?/g, '').trim();
          const userParts = userClean.split(/[\s.]+/).filter(p => p.length > 0);
          const userFirst = userParts[0] || '';
          const userLast = userParts[userParts.length - 1] || '';

          // Surname matching (fuzzy dist 1 allowed for spelling errors like Patil vs Paatil)
          const surnameDist = levenshtein(excelLast, userLast);
          if (surnameDist <= 1) {
            // If surname matches, check first name/initials
            if (excelFirst && userFirst) {
              if (excelFirst === userFirst) {
                score = 90; // Both match
              } else if (excelFirst[0] === userFirst[0]) {
                score = 85; // Surname + Initial match
              } else if (levenshtein(excelFirst, userFirst) <= 2) {
                score = 80; // Surname + Fuzzy First Name
              }
            }
          }
        }

        // 3. EMAIL-BASED MATCHING (Fallback)
        if (score < 85 && normExcelName.length > 4) {
          // If "atishpatil" appears in "atishpatil@123.gmail.com"
          if (userEmailPrefix.includes(normExcelName) || normExcelName.includes(userEmailPrefix)) {
            score = Math.max(score, 75);
          }
        }

        // 4. CROSS-MATCH (Excel name matches User email prefix)
        if (score < 75 && normExcelName && normExcelName === userEmailPrefix) {
          score = 70;
        }

        // Update best match if this score is higher
        if (score > highestScore) {
          highestScore = score;
          bestMatch = user;
        }
      }

      // Final Confidence Threshold
      // Only return matches with a minimum level of confidence
      return highestScore >= 70 ? bestMatch : null;
    };

    // --- Pass 0: Standardize non-system names within this import batch ---
    const nonSystemNormalizationMap = new Map();

    const getCleanedNameForStorage = (name) => {
      if (!name) return '';
      return String(name)
        .replace(/\b(dr|prof|mr|ms|mrs|shri|shree|sh|smt|kumari|shrimati|adv|er)\b\.?/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const areSimilarNonSystem = (name1, name2) => {
      const n1 = normalizeName(name1);
      const n2 = normalizeName(name2);
      if (!n1 || !n2) return false;
      if (n1 === n2) return true;

      const cleanRegex = /\b(dr|prof|mr|ms|mrs|shri|shree|sh|smt|kumari|shrimati|adv|er)\b\.?/gi;
      const p1 = name1.toLowerCase().replace(cleanRegex, '').split(/[\s.]+/).filter(Boolean);
      const p2 = name2.toLowerCase().replace(cleanRegex, '').split(/[\s.]+/).filter(Boolean);

      if (p1.length >= 2 && p2.length >= 2) {
        const last1 = p1[p1.length - 1];
        const last2 = p2[p2.length - 1];
        if (levenshtein(last1, last2) <= 1) {
          if (p1[0][0] === p2[0][0]) return true;
        }
      }
      return false;
    };

    const allNamesInBatch = new Set();
    const splitNamesHelper = (value) => {
      if (!value) return [];
      return String(value).split(/[,/&]| and /i).map(p => p.trim()).filter(Boolean);
    };

    for (const rec of records) {
      if (Array.isArray(rec.contacts)) {
        rec.contacts.forEach(c => { if (c.contactPerson) allNamesInBatch.add(c.contactPerson); });
      } else if (rec.contactPerson) {
        splitNamesHelper(rec.contactPerson).forEach(p => allNamesInBatch.add(p));
      }
    }

    const nonSystemNames = Array.from(allNamesInBatch).filter(name => !findMatchingUser(name, ''));

    if (nonSystemNames.length > 0) {
      const clusters = [];
      for (const name of nonSystemNames) {
        let matchedCluster = null;
        for (const cluster of clusters) {
          if (areSimilarNonSystem(name, cluster.representative)) {
            matchedCluster = cluster;
            break;
          }
        }

        const cleaned = getCleanedNameForStorage(name);
        if (matchedCluster) {
          matchedCluster.originalNames.push(name);
          const currentRepParts = matchedCluster.representative.split(' ').length;
          const newParts = cleaned.split(' ').length;
          if (newParts > currentRepParts || (newParts === currentRepParts && cleaned.length > matchedCluster.representative.length)) {
            matchedCluster.representative = cleaned;
          }
        } else {
          clusters.push({ representative: cleaned, originalNames: [name] });
        }
      }

      for (const cluster of clusters) {
        for (const orig of cluster.originalNames) {
          nonSystemNormalizationMap.set(orig, cluster.representative);
        }
      }
    }

    // Basic validation and mapping if needed before bulk insert
    const validatedRecords = [];
    let duplicateCount = 0;
    let lockedSkipCount = 0;
    const insertedByYear = {};
    const duplicatesByYear = {};
    const lockedByYear = {};
    
    for (const record of records) {
      // Ensure numeric fields are numbers
      const num = (v) => {
        const parsed = parseInt(v);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Helper to parse date string or Excel serial to Date object
      const parseToDate = (v) => {
        if (!v) return undefined;
        
        // Handle potential string versions of dates (DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY)
        if (typeof v === 'string') {
          // Clean up the string (remove things like [object Object] if they somehow got in)
          const cleanV = v.replace(/\[object\s+Object\]/gi, '').trim();
          if (!cleanV) return undefined;

          // Match DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
          const match = cleanV.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
          if (match) {
            let [_, d, m, y] = match;
            if (y.length === 2) y = '20' + y;
            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            if (!isNaN(dateObj.getTime())) return dateObj;
          }

          // Fallback to native Date parsing for strings
          const d = new Date(v);
          if (!isNaN(d.getTime()) && d.getFullYear() > 1970) return d;
        }

        // Handle Excel serial numbers if they come through as numbers
        if (typeof v === 'number' && v > 0) {
          // Excel dates are number of days since Dec 30, 1899
          const d = new Date((v - 25569) * 86400 * 1000);
          if (!isNaN(d.getTime())) return d;
        }

        // Handle Date objects
        if (v instanceof Date && !isNaN(v.getTime())) {
          return v;
        }
        
        return undefined;
      };

      // Standardize date fields
      const startDateObj = parseToDate(record.startDate);
      const endDateObj = parseToDate(record.endDate) || startDateObj;

      // Determine the year
      let finalYear;
      if (startDateObj) {
        finalYear = startDateObj.getFullYear();
      } else {
        finalYear = num(record.year) || new Date().getFullYear();
      }

      // Infer eventType from category if missing
      const cat = (record.eventCategory || '').toLowerCase();
      const eventType = record.eventType || (cat.includes('training') ? 'Training' : 'Extension Activities');

      // Ensure discipline is an array of lowercase strings
      let disciplineArr = [];
      if (Array.isArray(record.discipline)) {
        disciplineArr = record.discipline.map(d => String(d).trim().toLowerCase()).filter(Boolean);
      } else if (typeof record.discipline === 'string' && record.discipline.trim()) {
        disciplineArr = record.discipline.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
      }

      // Helper to detect "All KVK Staff" style contact names
      const isAllKvkStaffName = (name) => {
        if (!name) return false;
        const s = String(name)
          .toLowerCase()
          .replace(/\b(dr|prof|mr|ms|mrs)\b\.?/g, '')
          .replace(/[^a-z]/g, '');
        // Match variants like "allkvkstaff", "allstaffofkvkdhule", etc.
        if (!s) return false;
        if (s.includes('allkvkstaff')) return true;
        if (s.includes('allstaffofkvkdhule')) return true;
        if (s.includes('allstaffkvkdhule')) return true;
        if (s === 'allstaffkvk' || s === 'allkvk') return true;
        return false;
      };

      // Construct contacts array and try to match with system users
      let contacts = [];
      if (Array.isArray(record.contacts) && record.contacts.length > 0) {
        contacts = record.contacts.map(c => {
          const matched = findMatchingUser(c.contactPerson, c.email);
          // Prefer email from Excel; only fall back to user's email when Excel has none
          const excelEmail = (c.email || record.email || '').toString().trim();
          if (matched) {
            return {
              ...c,
              contactPerson: matched.name,
              designation: matched.designation || c.designation || '',
              email: excelEmail || matched.email || '',
              mobile: matched.phone || c.mobile || '',
              discipline: matched.discipline || '-'  // ignore Excel discipline when user exists
            };
          }
          return {
            ...c,
            contactPerson: nonSystemNormalizationMap.get(c.contactPerson) || c.contactPerson,
            email: excelEmail,
            discipline: c.discipline || '-'
          };
        });
      } else if (record.contactPerson || record.email || record.mobile || record.landline) {
        // Handle multiple contact persons in a single cell, e.g. "Dr. A. A. Patil, Dr.D.M.Choudhari"
        const splitContactNames = (value) => {
          if (!value) return [];
          return String(value)
            .split(/[,/&]| and /i)
            .map((part) => part.trim())
            .filter((part) => part.length > 0);
        };

        const contactNames = splitContactNames(record.contactPerson);

        // If the designation / email / mobile cells also contain multiple
        // comma‑separated values, try to map them positionally to each contact person.
        const designationArr = typeof record.designation === 'string'
          ? record.designation.split(',').map((d) => d.trim()).filter(Boolean)
          : [];
        const emailArr = typeof record.email === 'string'
          ? record.email.split(',').map((d) => d.trim()).filter(Boolean)
          : [];
        const mobileArr = typeof record.mobile === 'string'
          ? record.mobile.split(',').map((d) => d.trim()).filter(Boolean)
          : [];

        // If multiple names are present, try to create one contact per name
        const namesToProcess = contactNames.length > 0 ? contactNames : [record.contactPerson];

        for (let i = 0; i < namesToProcess.length; i++) {
          const name = namesToProcess[i];

          const emailForThis = emailArr[i] || emailArr[0] || record.email || '';
          const mobileForThis = mobileArr[i] || mobileArr[0] || record.mobile || '';

          const matchedUser = findMatchingUser(name, emailForThis);

          // For matched users: use Excel email if present, otherwise fall back to user's email.
          if (matchedUser) {
            contacts.push({
              contactPerson: matchedUser.name,
              designation: matchedUser.designation || designationArr[i] || designationArr[0] || record.designation || '',
              email: (emailForThis || '').toString().trim() || matchedUser.email || '',
              mobile: matchedUser.phone || mobileForThis,
              landline: record.landline || '',
              discipline: matchedUser.discipline || '-'  // never derive from Excel when user exists
            });
            continue;
          }

          // For non‑system users, we fall back to Excel values, and only then
          // try to infer discipline from designation text and the master list.
          let disciplineForThis =
            disciplineArr[i] || disciplineArr[0] || undefined;
          const designationForThis =
            designationArr[i] || designationArr[0] || record.designation || '';

          if (!disciplineForThis || disciplineForThis === '-' || disciplineForThis === '--') {
            const desigLower = (designationForThis || '').toLowerCase();
            for (const d of allDisciplines) {
              const nameLower = (d.name || '').toLowerCase();
              if (!nameLower) continue;
              if (desigLower.includes(nameLower)) {
                disciplineForThis = d.name;
                break;
              }
            }
          }

          contacts.push({
            contactPerson: nonSystemNormalizationMap.get(name) || name || record.contactPerson || 'Unknown',
            designation: designationForThis,
            email: emailForThis,
            mobile: mobileForThis,
            landline: record.landline || '',
            discipline: disciplineForThis || '-'
          });
        }
      }

      // If any contact looks like "All KVK Staff", force discipline to all_kvk
      let hasAllKvkContact = contacts.some(c => isAllKvkStaffName(c.contactPerson));
      if (hasAllKvkContact) {
        contacts = contacts.map(c =>
          isAllKvkStaffName(c.contactPerson)
            ? { ...c, discipline: 'all_kvk' }
            : c
        );
      }

      // Derived disciplines from the contacts
      let derivedDisciplines = [...new Set(contacts.map(c => c.discipline).filter(Boolean))];
      if (hasAllKvkContact) {
        // If any contact represents "All KVK Staff", this record should belong
        // to the special all_kvk discipline so it appears in all modules.
        derivedDisciplines = ['all_kvk'];
      }

      // DISCIPLINE FILTERING: If disciplineFilter is provided, skip records that don't match
      if (disciplineFilterLower) {
        // Record is allowed if its derived disciplines include the filter, 
        // or if it's 'all_kvk' (which belongs to all disciplines)
        const isMatch = derivedDisciplines.some(d => 
          String(d).toLowerCase().trim() === disciplineFilterLower || 
          String(d).toLowerCase().trim() === 'all_kvk'
        );
        if (!isMatch) continue;
      }

      const mappedRecord = {
        ...record,
        year: finalYear,
        eventType: eventType,
        eventCategory: record.eventCategory || 'Uncategorized',
        eventName: record.eventName || record.title || 'Unnamed Event',
        startDate: startDateObj || new Date(finalYear, 0, 1),
        endDate: endDateObj || new Date(finalYear, 0, 1),
        venuePlace: record.venuePlace || record.venue || 'Unknown Venue',
        venueTal: record.venueTal || '',
        venueDist: record.venueDist || '',
        targetGroup: record.targetGroup || 'General',
        mediaCoverage: record.mediaCoverage || 'No',
        genMale: num(record.genMale || record.male),
        genFemale: num(record.genFemale || record.female),
        scMale: num(record.scMale),
        scFemale: num(record.scFemale),
        scTotal: num(record.scTotal || record.sc),
        stMale: num(record.stMale),
        stFemale: num(record.stFemale),
        stTotal: num(record.stTotal || record.st),
        otherMale: num(record.otherMale),
        otherFemale: num(record.otherFemale),
        efMale: num(record.efMale),
        efFemale: num(record.efFemale),
        chiefGuestCategory: record.chiefGuestCategory || '',
        chiefGuest: record.chiefGuest || '',
        inauguratedBy: record.inauguratedBy || '',
        chiefGuestRemark: record.chiefGuestRemark || '',
        postEventDetails: record.postEventDetails || '',
        discipline: derivedDisciplines.length > 0 ? derivedDisciplines : (disciplineArr.length > 0 ? disciplineArr : ['-']),
        contacts: contacts,
        createdByName: record.createdByName || 'Imported'
      };

      // Check for duplicates in the database before adding to validation list
      const dbDuplicate = await DataEntry.findOne({
        year: finalYear,
        eventType: { $regex: new RegExp(`^${String(eventType || '').trim()}$`, 'i') },
        eventCategory: { $regex: new RegExp(`^${String(record.eventCategory || '').trim()}$`, 'i') },
        eventName: { $regex: new RegExp(`^${String(record.eventName || '').trim()}$`, 'i') },
        startDate: startDateObj,
        venuePlace: { $regex: new RegExp(`^${String(record.venuePlace || record.venue || '').trim()}$`, 'i') }
      });

      // Year lock check: skip records for locked years (non-admin)
      const recordYear = parseInt(mappedRecord.year, 10);
      if (!isNaN(recordYear) && lockedYearsSet.has(recordYear)) {
        lockedSkipCount++;
        const y = String(recordYear);
        if (y) lockedByYear[y] = (lockedByYear[y] || 0) + 1;
        continue;
      }

      if (!dbDuplicate) {
        validatedRecords.push(mappedRecord);
        const y = String(mappedRecord.year || '');
        if (y) insertedByYear[y] = (insertedByYear[y] || 0) + 1;
      } else {
        duplicateCount++;
        const y = String(mappedRecord.year || '');
        if (y) duplicatesByYear[y] = (duplicatesByYear[y] || 0) + 1;
      }
    }

    if (validatedRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new records to import (all records were duplicates or belong to locked years)',
        count: 0,
        duplicateCount,
        lockedSkipCount,
        yearBreakdown: {
          inserted: insertedByYear,
          duplicates: duplicatesByYear,
          locked: lockedByYear
        }
      });
    }

    // Bulk insert using insertMany for efficiency
    // We use ordered: false so that if one fails, others still insert
    const result = await DataEntry.insertMany(validatedRecords, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Successfully imported ${result.length} records. ${duplicateCount} duplicates were skipped.${lockedSkipCount > 0 ? ` ${lockedSkipCount} records skipped (locked years).` : ''}`,
      count: result.length,
      insertedRecords: result, // Add this to support temporary table and Undo feature
      duplicateCount,
      lockedSkipCount,
      yearBreakdown: {
        inserted: insertedByYear,
        duplicates: duplicatesByYear,
        locked: lockedByYear
      }
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    // If it's a partial success (some records failed validation or duplicate keys)
    if (error.name === 'BulkWriteError' || error.name === 'MongoBulkWriteError') {
      return res.status(207).json({
        success: true,
        message: `Imported with some errors. ${error.result.nInserted} records saved.`,
        insertedCount: error.result.nInserted,
        errorCount: error.writeErrors ? error.writeErrors.length : 0
      });
    }
    res.status(500).json({ message: 'Internal server error during bulk import', error: error.message });
  }
};

module.exports = {
  bulkImportDataEntry
};
