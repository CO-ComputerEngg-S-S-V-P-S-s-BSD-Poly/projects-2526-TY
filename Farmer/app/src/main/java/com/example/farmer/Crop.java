package com.example.farmer;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class Crop implements Serializable {
    private String id, name, soilType, temperature, fertilizer, duration, imageUrl, season;

    // STEP 1: PRE-SOWING (THE FOUNDATION)
    private String soilTypeDetailed;  // e.g., "Black Cotton Soil"
    private String pHRange;           // e.g., "6.5 - 7.5"
    private String basalDose;         // Initial fertilizers for land prep
    private String climate;           // Min/Max Temp thresholds

    // STEP 2: SOWING MANAGEMENT (THE PROTOCOL)
    private String sowingWindow;      // e.g., "June 15 – July 10"
    private String seedRate;          // Amount in kg per acre/hectare
    private String spacing;           // Row & Plant distance in cm (R × P)
    private String seedTreatment;     // Fungicide/dosage per kg

    // STEP 3: NUTRIENT & WATER SCHEDULE (THE TIMELINE)
    private String fertilizerSplit;   // Table of DAS and N-P-K dosage
    private String irrigationPoints;  // Critical stages (e.g., Flowering)
    private String micronutrients;    // Zinc or Boron requirements

    // STEP 4: CROP PROTECTION (THE DIAGNOSTICS)
    private String pestName;          // Common and Scientific name
    private String visualSymptoms;    // 3-4 bullet points of what is seen
    private String chemicalSolution;  // Active ingredient & dilution ratio

    // STEP 5: STORAGE (THE FINANCIAL SHIELD)
    private String harvestMoisture;   // Ideal % at harvest
    private String storageTemp;       // Exact Celsius to prevent rot
    private String relativeHumidity;  // Threshold to prevent fungi
    private String bagging;           // Material type & stacking limits

    // Additional fields for enhanced guidance
    private String diseaseImages;     // URLs for disease identification images
    private String expertTips;        // Additional expert recommendations
    private Map<String, Object> additionalData; // For future extensibility

    public Crop() {} // Required for Firebase

    // Constructor with core fields
    public Crop(String name, String soilType, String temperature, String fertilizer,
                String duration, String season) {
        this.name = name;
        this.soilType = soilType;
        this.temperature = temperature;
        this.fertilizer = fertilizer;
        this.duration = duration;
        this.season = season;
        this.additionalData = new HashMap<>();
    }

    // Getters and setters for existing fields
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }
    public String getFertilizer() { return fertilizer; }
    public void setFertilizer(String fertilizer) { this.fertilizer = fertilizer; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    // Getters and setters for STEP 1: PRE-SOWING
    public String getSoilTypeDetailed() { return soilTypeDetailed; }
    public void setSoilTypeDetailed(String soilTypeDetailed) { this.soilTypeDetailed = soilTypeDetailed; }
    public String getPHRange() { return pHRange; }
    public void setPHRange(String pHRange) { this.pHRange = pHRange; }
    public String getBasalDose() { return basalDose; }
    public void setBasalDose(String basalDose) { this.basalDose = basalDose; }
    public String getClimate() { return climate; }
    public void setClimate(String climate) { this.climate = climate; }

    // Getters and setters for STEP 2: SOWING MANAGEMENT
    public String getSowingWindow() { return sowingWindow; }
    public void setSowingWindow(String sowingWindow) { this.sowingWindow = sowingWindow; }
    public String getSeedRate() { return seedRate; }
    public void setSeedRate(String seedRate) { this.seedRate = seedRate; }
    public String getSpacing() { return spacing; }
    public void setSpacing(String spacing) { this.spacing = spacing; }
    public String getSeedTreatment() { return seedTreatment; }
    public void setSeedTreatment(String seedTreatment) { this.seedTreatment = seedTreatment; }

    // Getters and setters for STEP 3: NUTRIENT & WATER SCHEDULE
    public String getFertilizerSplit() { return fertilizerSplit; }
    public void setFertilizerSplit(String fertilizerSplit) { this.fertilizerSplit = fertilizerSplit; }
    public String getIrrigationPoints() { return irrigationPoints; }
    public void setIrrigationPoints(String irrigationPoints) { this.irrigationPoints = irrigationPoints; }
    public String getMicronutrients() { return micronutrients; }
    public void setMicronutrients(String micronutrients) { this.micronutrients = micronutrients; }

    // Getters and setters for STEP 4: CROP PROTECTION
    public String getPestName() { return pestName; }
    public void setPestName(String pestName) { this.pestName = pestName; }
    public String getVisualSymptoms() { return visualSymptoms; }
    public void setVisualSymptoms(String visualSymptoms) { this.visualSymptoms = visualSymptoms; }
    public String getChemicalSolution() { return chemicalSolution; }
    public void setChemicalSolution(String chemicalSolution) { this.chemicalSolution = chemicalSolution; }

    // Getters and setters for STEP 5: STORAGE
    public String getHarvestMoisture() { return harvestMoisture; }
    public void setHarvestMoisture(String harvestMoisture) { this.harvestMoisture = harvestMoisture; }
    public String getStorageTemp() { return storageTemp; }
    public void setStorageTemp(String storageTemp) { this.storageTemp = storageTemp; }
    public String getRelativeHumidity() { return relativeHumidity; }
    public void setRelativeHumidity(String relativeHumidity) { this.relativeHumidity = relativeHumidity; }
    public String getBagging() { return bagging; }
    public void setBagging(String bagging) { this.bagging = bagging; }

    // Getters and setters for additional fields
    public String getDiseaseImages() { return diseaseImages; }
    public void setDiseaseImages(String diseaseImages) { this.diseaseImages = diseaseImages; }
    public String getExpertTips() { return expertTips; }
    public void setExpertTips(String expertTips) { this.expertTips = expertTips; }
    public Map<String, Object> getAdditionalData() { return additionalData; }
    public void setAdditionalData(Map<String, Object> additionalData) { this.additionalData = additionalData; }

    // Helper method to check if detailed data is available
    public boolean hasDetailedData() {
        return soilTypeDetailed != null || pHRange != null || basalDose != null ||
                sowingWindow != null || seedRate != null || spacing != null ||
                fertilizerSplit != null || pestName != null || harvestMoisture != null;
    }

    @Override
    public String toString() {
        return "Crop{" +
                "name='" + name + '\'' +
                ", season='" + season + '\'' +
                '}';
    }
}