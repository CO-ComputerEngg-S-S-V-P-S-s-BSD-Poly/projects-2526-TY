package com.example.farmer;

import android.view.MenuItem;
import androidx.appcompat.widget.Toolbar;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.*;
import com.google.firebase.database.*;
import com.google.firebase.storage.FirebaseStorage;
import java.util.ArrayList;
import java.util.List;

public class CropListActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private CropAdapter adapter;
    private DatabaseReference cropsRef;
    private String season, role;
    private List<Crop> cropList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crop_list);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        season = getIntent().getStringExtra("season");
        role = getIntent().getStringExtra("role");

        setTitle(season.substring(0,1).toUpperCase() + season.substring(1) + " Crops");

        cropsRef = FirebaseDatabase.getInstance().getReference("crops").child(season);
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        adapter = new CropAdapter(cropList, role.equals("admin"));
        recyclerView.setAdapter(adapter);

        loadCrops();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void loadCrops() {
        cropsRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                cropList.clear();
                for (DataSnapshot cropSnapshot : snapshot.getChildren()) {
                    Crop crop = cropSnapshot.getValue(Crop.class);
                    if (crop != null) {
                        crop.setId(cropSnapshot.getKey());
                        cropList.add(crop);
                    }
                }
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(DatabaseError error) {
                Toast.makeText(CropListActivity.this, "Error: " + error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    // Inner CropAdapter
    class CropAdapter extends RecyclerView.Adapter<CropAdapter.ViewHolder> {
        private List<Crop> crops;
        private boolean isAdmin;

        CropAdapter(List<Crop> crops, boolean isAdmin) {
            this.crops = crops;
            this.isAdmin = isAdmin;
        }

        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_crop, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            Crop crop = crops.get(position);
            holder.nameText.setText(crop.getName());
            holder.detailText.setText("🌱 " + crop.getSoilType() + " | 🌡️ " + crop.getTemperature());

            holder.itemView.setOnClickListener(v -> {
                Intent intent = new Intent(CropListActivity.this, CropDetailActivity.class);
                intent.putExtra("cropId", crop.getId());
                intent.putExtra("season", season);
                startActivity(intent);
            });

            if (isAdmin) {
                holder.itemView.setOnLongClickListener(v -> {
                    showAdminDialog(crop);
                    return true;
                });
            }
        }

        private void showAdminDialog(Crop crop) {
            String[] options = {"Edit", "Delete"};
            new AlertDialog.Builder(CropListActivity.this)
                    .setTitle("Manage " + crop.getName())
                    .setItems(options, (dialog, which) -> {
                        if (which == 0) { // Edit
                            Intent intent = new Intent(CropListActivity.this, CropFormActivity.class);
                            intent.putExtra("crop", crop);  // Fixed: was (CharSequence) cast
                            intent.putExtra("season", season);
                            startActivity(intent);
                        } else { // Delete
                            new AlertDialog.Builder(CropListActivity.this)
                                    .setTitle("Delete Crop")
                                    .setMessage("Are you sure?")
                                    .setPositiveButton("Yes", (d, w) -> {
                                        cropsRef.child(crop.getId()).removeValue();
                                        if (crop.getImageUrl() != null && !crop.getImageUrl().isEmpty()) {
                                            try {
                                                FirebaseStorage.getInstance().getReferenceFromUrl(crop.getImageUrl()).delete();
                                            } catch (Exception e) {
                                                // Ignore if URL is not from Firebase Storage
                                            }
                                        }
                                    })
                                    .setNegativeButton("No", null)
                                    .show();
                        }
                    })
                    .show();
        }

        @Override
        public int getItemCount() { return crops.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView nameText, detailText;
            ViewHolder(View itemView) {
                super(itemView);
                nameText = itemView.findViewById(R.id.cropName);
                detailText = itemView.findViewById(R.id.cropDetail);
            }
        }
    }
}