package com.example.farmer;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class CropFormActivity extends AppCompatActivity {
    // Basic fields
    private EditText nameET, soilET, tempET, fertilizerET, durationET;
    private Spinner seasonSpinner;

    // STEP 1: PRE-SOWING
    private EditText soilTypeDetailedET, phRangeET, basalDoseET, climateET;

    // STEP 2: SOWING MANAGEMENT
    private EditText sowingWindowET, seedRateET, spacingET, seedTreatmentET;

    // STEP 3: NUTRIENT & WATER
    private EditText fertilizerSplitET, irrigationPointsET, micronutrientsET;

    // STEP 4: CROP PROTECTION
    private EditText pestNameET, visualSymptomsET, chemicalSolutionET;

    // STEP 5: STORAGE
    private EditText harvestMoistureET, storageTempET, relativeHumidityET, baggingET;

    // Image URL field
    private EditText imageUrlET;
    private Button saveBtn;
    private DatabaseReference cropsRef;
    private Crop editCrop;
    private String editSeason;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crop_form);

        cropsRef = FirebaseDatabase.getInstance().getReference("crops");
        initViews();
        checkForEdit();
    }

    private void initViews() {
        // Basic fields
        nameET = findViewById(R.id.cropNameET);
        soilET = findViewById(R.id.soilTypeET);
        tempET = findViewById(R.id.temperatureET);
        fertilizerET = findViewById(R.id.fertilizerET);
        durationET = findViewById(R.id.durationET);
        seasonSpinner = findViewById(R.id.seasonSpinner);

        // Image URL field
        imageUrlET = findViewById(R.id.imageUrlET);

        // STEP 1: PRE-SOWING
        soilTypeDetailedET = findViewById(R.id.soilTypeDetailedET);
        phRangeET = findViewById(R.id.phRangeET);
        basalDoseET = findViewById(R.id.basalDoseET);
        climateET = findViewById(R.id.climateET);

        // STEP 2: SOWING MANAGEMENT
        sowingWindowET = findViewById(R.id.sowingWindowET);
        seedRateET = findViewById(R.id.seedRateET);
        spacingET = findViewById(R.id.spacingET);
        seedTreatmentET = findViewById(R.id.seedTreatmentET);

        // STEP 3: NUTRIENT & WATER
        fertilizerSplitET = findViewById(R.id.fertilizerSplitET);
        irrigationPointsET = findViewById(R.id.irrigationPointsET);
        micronutrientsET = findViewById(R.id.micronutrientsET);

        // STEP 4: CROP PROTECTION
        pestNameET = findViewById(R.id.pestNameET);
        visualSymptomsET = findViewById(R.id.visualSymptomsET);
        chemicalSolutionET = findViewById(R.id.chemicalSolutionET);

        // STEP 5: STORAGE
        harvestMoistureET = findViewById(R.id.harvestMoistureET);
        storageTempET = findViewById(R.id.storageTempET);
        relativeHumidityET = findViewById(R.id.relativeHumidityET);
        baggingET = findViewById(R.id.baggingET);

        saveBtn = findViewById(R.id.saveBtn);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.seasons, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        seasonSpinner.setAdapter(adapter);

        saveBtn.setOnClickListener(v -> saveCrop());
    }

    private void checkForEdit() {
        editCrop = (Crop) getIntent().getSerializableExtra("crop");
        if (editCrop != null) {
            setTitle("Edit Crop");

            // Basic fields
            nameET.setText(editCrop.getName());
            soilET.setText(editCrop.getSoilType());
            tempET.setText(editCrop.getTemperature());
            fertilizerET.setText(editCrop.getFertilizer());
            durationET.setText(editCrop.getDuration());
            imageUrlET.setText(editCrop.getImageUrl());

            // STEP 1: PRE-SOWING
            soilTypeDetailedET.setText(editCrop.getSoilTypeDetailed());
            phRangeET.setText(editCrop.getPHRange());
            basalDoseET.setText(editCrop.getBasalDose());
            climateET.setText(editCrop.getClimate());

            // STEP 2: SOWING MANAGEMENT
            sowingWindowET.setText(editCrop.getSowingWindow());
            seedRateET.setText(editCrop.getSeedRate());
            spacingET.setText(editCrop.getSpacing());
            seedTreatmentET.setText(editCrop.getSeedTreatment());

            // STEP 3: NUTRIENT & WATER
            fertilizerSplitET.setText(editCrop.getFertilizerSplit());
            irrigationPointsET.setText(editCrop.getIrrigationPoints());
            micronutrientsET.setText(editCrop.getMicronutrients());

            // STEP 4: CROP PROTECTION
            pestNameET.setText(editCrop.getPestName());
            visualSymptomsET.setText(editCrop.getVisualSymptoms());
            chemicalSolutionET.setText(editCrop.getChemicalSolution());

            // STEP 5: STORAGE
            harvestMoistureET.setText(editCrop.getHarvestMoisture());
            storageTempET.setText(editCrop.getStorageTemp());
            relativeHumidityET.setText(editCrop.getRelativeHumidity());
            baggingET.setText(editCrop.getBagging());

            editSeason = getIntent().getStringExtra("season");

            // Set spinner to correct season
            String[] seasons = getResources().getStringArray(R.array.seasons);
            for (int i = 0; i < seasons.length; i++) {
                if (seasons[i].equalsIgnoreCase(editSeason)) {
                    seasonSpinner.setSelection(i);
                    break;
                }
            }
        }
    }

    private void saveCrop() {
        // Basic fields validation
        String name = nameET.getText().toString().trim();
        String soil = soilET.getText().toString().trim();
        String temp = tempET.getText().toString().trim();
        String fertilizer = fertilizerET.getText().toString().trim();
        String duration = durationET.getText().toString().trim();
        String season = seasonSpinner.getSelectedItem().toString().toLowerCase();
        String imageUrl = imageUrlET.getText().toString().trim();

        if (name.isEmpty() || soil.isEmpty() || temp.isEmpty() || fertilizer.isEmpty() || duration.isEmpty()) {
            Toast.makeText(this, "Fill all basic fields", Toast.LENGTH_SHORT).show();
            return;
        }

        Crop crop = new Crop(name, soil, temp, fertilizer, duration, season);
        crop.setImageUrl(imageUrl);

        // STEP 1: PRE-SOWING
        crop.setSoilTypeDetailed(soilTypeDetailedET.getText().toString().trim());
        crop.setPHRange(phRangeET.getText().toString().trim());
        crop.setBasalDose(basalDoseET.getText().toString().trim());
        crop.setClimate(climateET.getText().toString().trim());

        // STEP 2: SOWING MANAGEMENT
        crop.setSowingWindow(sowingWindowET.getText().toString().trim());
        crop.setSeedRate(seedRateET.getText().toString().trim());
        crop.setSpacing(spacingET.getText().toString().trim());
        crop.setSeedTreatment(seedTreatmentET.getText().toString().trim());

        // STEP 3: NUTRIENT & WATER
        crop.setFertilizerSplit(fertilizerSplitET.getText().toString().trim());
        crop.setIrrigationPoints(irrigationPointsET.getText().toString().trim());
        crop.setMicronutrients(micronutrientsET.getText().toString().trim());

        // STEP 4: CROP PROTECTION
        crop.setPestName(pestNameET.getText().toString().trim());
        crop.setVisualSymptoms(visualSymptomsET.getText().toString().trim());
        crop.setChemicalSolution(chemicalSolutionET.getText().toString().trim());

        // STEP 5: STORAGE
        crop.setHarvestMoisture(harvestMoistureET.getText().toString().trim());
        crop.setStorageTemp(storageTempET.getText().toString().trim());
        crop.setRelativeHumidity(relativeHumidityET.getText().toString().trim());
        crop.setBagging(baggingET.getText().toString().trim());

        if (editCrop != null) {
            // Update existing crop
            crop.setId(editCrop.getId());

            if (!editSeason.equals(season)) {
                // Season changed - move crop
                cropsRef.child(editSeason).child(editCrop.getId()).removeValue();
                cropsRef.child(season).child(editCrop.getId()).setValue(crop)
                        .addOnSuccessListener(aVoid -> {
                            Toast.makeText(this, "Crop updated successfully", Toast.LENGTH_SHORT).show();
                            finish();
                        })
                        .addOnFailureListener(e -> Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            } else {
                // Same season - just update
                cropsRef.child(season).child(editCrop.getId()).setValue(crop)
                        .addOnSuccessListener(aVoid -> {
                            Toast.makeText(this, "Crop updated successfully", Toast.LENGTH_SHORT).show();
                            finish();
                        })
                        .addOnFailureListener(e -> Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        } else {
            // New crop
            String cropId = cropsRef.child(season).push().getKey();
            crop.setId(cropId);

            cropsRef.child(season).child(cropId).setValue(crop)
                    .addOnSuccessListener(aVoid -> {
                        Toast.makeText(this, "Crop added successfully", Toast.LENGTH_SHORT).show();
                        finish();
                    })
                    .addOnFailureListener(e -> Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
        }
    }
}