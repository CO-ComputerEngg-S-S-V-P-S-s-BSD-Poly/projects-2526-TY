const DataEntry = require('../models/DataEntry');

// @desc    Bulk import data entry records from Excel
// @route   POST /api/import/bulk-data-entry
// @access  Private
const bulkImportDataEntry = async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No records provided for import' });
    }

    // Basic validation and mapping if needed before bulk insert
    const validatedRecords = records.map(record => {
      // Ensure numeric fields are numbers
      const num = (v) => {
        const parsed = parseInt(v);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Format date to DD/MM/YYYY string
      const formatDateString = (v) => {
        if (!v) return undefined;
        
        // If it's already a DD/MM/YYYY string, return it
        if (typeof v === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
          return v;
        }

        let d = v;
        if (!(d instanceof Date)) {
          d = new Date(v);
        }
        
        if (isNaN(d.getTime())) return undefined;
        
        // Prevent 1970/1900 errors
        if (d.getTime() < 31536000000) return undefined;

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Ensure discipline is an array of lowercase strings
      let disciplineArr = [];
      if (Array.isArray(record.discipline)) {
        disciplineArr = record.discipline.map(d => String(d).trim().toLowerCase()).filter(Boolean);
      } else if (typeof record.discipline === 'string' && record.discipline.trim()) {
        disciplineArr = record.discipline.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
      }

      // Calculate the year from the record
      const getYear = () => {
        if (record.startDate) {
          // If it's already a DD/MM/YYYY string, extract the year from the end
          if (typeof record.startDate === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(record.startDate)) {
            const parts = record.startDate.split('/');
            return parseInt(parts[2]);
          }

          let d = record.startDate;
          if (!(d instanceof Date)) d = new Date(record.startDate);
          if (!isNaN(d.getTime()) && d.getTime() > 31536000000) return d.getFullYear();
        }
        const y = num(record.year);
        return y > 1900 ? y : new Date().getFullYear();
      };

      const finalYear = getYear();
      const finalStartDate = formatDateString(record.startDate) || `01/01/${finalYear}`;

      return {
        ...record,
        year: finalYear,
        startDate: finalStartDate,
        endDate: formatDateString(record.endDate),
        genMale: num(record.genMale),
        genFemale: num(record.genFemale),
        scMale: num(record.scMale),
        scFemale: num(record.scFemale),
        stMale: num(record.stMale),
        stFemale: num(record.stFemale),
        otherMale: num(record.otherMale),
        otherFemale: num(record.otherFemale),
        efMale: num(record.efMale),
        efFemale: num(record.efFemale),
        discipline: disciplineArr,
        // Ensure contacts is an array
        contacts: Array.isArray(record.contacts) ? record.contacts : []
      };
    });

    // Bulk insert using insertMany for efficiency
    // We use ordered: false so that if one fails, others still insert
    const result = await DataEntry.insertMany(validatedRecords, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Successfully imported ${result.length} records`,
      count: result.length
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
