package com.example.farmer;

import android.graphics.Color;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.google.firebase.database.*;

public class CropDetailActivity extends AppCompatActivity {
    // Basic views
    private TextView nameTV, soilTV, tempTV, fertilizerTV, durationTV;
    private ImageView imageView;

    // STEP 1: PRE-SOWING views
    private TextView soilTypeDetailedTV, phRangeTV, basalDoseTV, climateTV;
    private LinearLayout preSowingLayout;

    // STEP 2: SOWING MANAGEMENT views
    private TextView sowingWindowTV, seedRateTV, spacingTV, seedTreatmentTV;
    private LinearLayout sowingLayout;

    // STEP 3: NUTRIENT & WATER views
    private TextView fertilizerSplitTV, irrigationPointsTV, micronutrientsTV;
    private LinearLayout nutrientLayout;

    // STEP 4: CROP PROTECTION views
    private TextView pestNameTV, visualSymptomsTV, chemicalSolutionTV;
    private LinearLayout protectionLayout;

    // STEP 5: STORAGE views
    private TextView harvestMoistureTV, storageTempTV, relativeHumidityTV, baggingTV;
    private LinearLayout storageLayout;

    private DatabaseReference cropRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crop_detail);

        String cropId = getIntent().getStringExtra("cropId");
        String season = getIntent().getStringExtra("season");

        cropRef = FirebaseDatabase.getInstance().getReference("crops")
                .child(season).child(cropId);

        initViews();
        loadCropDetails();
    }

    private void initViews() {
        // Basic views
        nameTV = findViewById(R.id.cropName);
        soilTV = findViewById(R.id.soilType);
        tempTV = findViewById(R.id.temperature);
        fertilizerTV = findViewById(R.id.fertilizer);
        durationTV = findViewById(R.id.duration);
        imageView = findViewById(R.id.cropImage);

        // STEP 1 layouts and views
        preSowingLayout = findViewById(R.id.preSowingLayout);
        soilTypeDetailedTV = findViewById(R.id.soilTypeDetailed);
        phRangeTV = findViewById(R.id.phRange);
        basalDoseTV = findViewById(R.id.basalDose);
        climateTV = findViewById(R.id.climate);

        // STEP 2 layouts and views
        sowingLayout = findViewById(R.id.sowingLayout);
        sowingWindowTV = findViewById(R.id.sowingWindow);
        seedRateTV = findViewById(R.id.seedRate);
        spacingTV = findViewById(R.id.spacing);
        seedTreatmentTV = findViewById(R.id.seedTreatment);

        // STEP 3 layouts and views
        nutrientLayout = findViewById(R.id.nutrientLayout);
        fertilizerSplitTV = findViewById(R.id.fertilizerSplit);
        irrigationPointsTV = findViewById(R.id.irrigationPoints);
        micronutrientsTV = findViewById(R.id.micronutrients);

        // STEP 4 layouts and views
        protectionLayout = findViewById(R.id.protectionLayout);
        pestNameTV = findViewById(R.id.pestName);
        visualSymptomsTV = findViewById(R.id.visualSymptoms);
        chemicalSolutionTV = findViewById(R.id.chemicalSolution);

        // STEP 5 layouts and views
        storageLayout = findViewById(R.id.storageLayout);
        harvestMoistureTV = findViewById(R.id.harvestMoisture);
        storageTempTV = findViewById(R.id.storageTemp);
        relativeHumidityTV = findViewById(R.id.relativeHumidity);
        baggingTV = findViewById(R.id.bagging);
    }

    private void loadCropDetails() {
        cropRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                Crop crop = snapshot.getValue(Crop.class);
                if (crop != null) {
                    // Set basic details
                    nameTV.setText(crop.getName());
                    soilTV.setText("🌱 Soil: " + crop.getSoilType());
                    tempTV.setText("🌡️ Temperature: " + crop.getTemperature());
                    fertilizerTV.setText("🧪 Fertilizer: " + crop.getFertilizer());
                    durationTV.setText("⏱️ Duration: " + crop.getDuration());

                    // Load image from URL
                    if (crop.getImageUrl() != null && !crop.getImageUrl().isEmpty()) {
                        Glide.with(CropDetailActivity.this)
                                .load(crop.getImageUrl())
                                .placeholder(R.drawable.card_background)
                                .error(R.drawable.card_background)
                                .centerCrop()
                                .into(imageView);
                    }

                    // STEP 1: PRE-SOWING details
                    if (hasPreSowingData(crop)) {
                        preSowingLayout.setVisibility(LinearLayout.VISIBLE);
                        setText(soilTypeDetailedTV, "🌱 Soil Type: " + crop.getSoilTypeDetailed());
                        setText(phRangeTV, "🧪 pH Range: " + crop.getPHRange());
                        setText(basalDoseTV, "🌿 Basal Dose: " + crop.getBasalDose());
                        setText(climateTV, "☀️ Climate: " + crop.getClimate());
                    }

                    // STEP 2: SOWING MANAGEMENT details
                    if (hasSowingData(crop)) {
                        sowingLayout.setVisibility(LinearLayout.VISIBLE);
                        setText(sowingWindowTV, "📅 Sowing Window: " + crop.getSowingWindow());
                        setText(seedRateTV, "🌱 Seed Rate: " + crop.getSeedRate());
                        setText(spacingTV, "📏 Spacing: " + crop.getSpacing());
                        setText(seedTreatmentTV, "💊 Seed Treatment: " + crop.getSeedTreatment());
                    }

                    // STEP 3: NUTRIENT & WATER details
                    if (hasNutrientData(crop)) {
                        nutrientLayout.setVisibility(LinearLayout.VISIBLE);
                        setText(fertilizerSplitTV, "🧪 Fertilizer Split: " + crop.getFertilizerSplit());
                        setText(irrigationPointsTV, "💧 Irrigation: " + crop.getIrrigationPoints());
                        setText(micronutrientsTV, "🔬 Micronutrients: " + crop.getMicronutrients());
                    }

                    // STEP 4: CROP PROTECTION details
                    if (hasProtectionData(crop)) {
                        protectionLayout.setVisibility(LinearLayout.VISIBLE);
                        setText(pestNameTV, "🐛 Pest: " + crop.getPestName());
                        setText(visualSymptomsTV, "👁️ Symptoms: " + crop.getVisualSymptoms());
                        setText(chemicalSolutionTV, "⚗️ Solution: " + crop.getChemicalSolution());
                    }

                    // STEP 5: STORAGE details
                    if (hasStorageData(crop)) {
                        storageLayout.setVisibility(LinearLayout.VISIBLE);
                        setText(harvestMoistureTV, "💧 Harvest Moisture: " + crop.getHarvestMoisture());
                        setText(storageTempTV, "🌡️ Storage Temp: " + crop.getStorageTemp());
                        setText(relativeHumidityTV, "💨 Relative Humidity: " + crop.getRelativeHumidity());
                        setText(baggingTV, "📦 Bagging: " + crop.getBagging());
                    }
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                Toast.makeText(CropDetailActivity.this, "Error: " + error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setText(TextView textView, String text) {
        if (text != null && !text.endsWith(": null") && !text.endsWith(": ")) {
            textView.setText(text);
            textView.setVisibility(TextView.VISIBLE);
        } else {
            textView.setVisibility(TextView.GONE);
        }
    }

    private boolean hasPreSowingData(Crop crop) {
        return crop.getSoilTypeDetailed() != null && !crop.getSoilTypeDetailed().isEmpty() ||
                crop.getPHRange() != null && !crop.getPHRange().isEmpty() ||
                crop.getBasalDose() != null && !crop.getBasalDose().isEmpty() ||
                crop.getClimate() != null && !crop.getClimate().isEmpty();
    }

    private boolean hasSowingData(Crop crop) {
        return crop.getSowingWindow() != null && !crop.getSowingWindow().isEmpty() ||
                crop.getSeedRate() != null && !crop.getSeedRate().isEmpty() ||
                crop.getSpacing() != null && !crop.getSpacing().isEmpty() ||
                crop.getSeedTreatment() != null && !crop.getSeedTreatment().isEmpty();
    }

    private boolean hasNutrientData(Crop crop) {
        return crop.getFertilizerSplit() != null && !crop.getFertilizerSplit().isEmpty() ||
                crop.getIrrigationPoints() != null && !crop.getIrrigationPoints().isEmpty() ||
                crop.getMicronutrients() != null && !crop.getMicronutrients().isEmpty();
    }

    private boolean hasProtectionData(Crop crop) {
        return crop.getPestName() != null && !crop.getPestName().isEmpty() ||
                crop.getVisualSymptoms() != null && !crop.getVisualSymptoms().isEmpty() ||
                crop.getChemicalSolution() != null && !crop.getChemicalSolution().isEmpty();
    }

    private boolean hasStorageData(Crop crop) {
        return crop.getHarvestMoisture() != null && !crop.getHarvestMoisture().isEmpty() ||
                crop.getStorageTemp() != null && !crop.getStorageTemp().isEmpty() ||
                crop.getRelativeHumidity() != null && !crop.getRelativeHumidity().isEmpty() ||
                crop.getBagging() != null && !crop.getBagging().isEmpty();
    }
}