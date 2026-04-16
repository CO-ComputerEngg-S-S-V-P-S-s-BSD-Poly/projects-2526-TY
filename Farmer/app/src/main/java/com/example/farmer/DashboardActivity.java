package com.example.farmer;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.*;
import com.google.firebase.auth.FirebaseAuth;
import java.util.Arrays;
import java.util.List;

public class DashboardActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private Button addCropBtn, logoutBtn;
    private TextView welcomeText;
    private String role;
    private List<String> seasons = Arrays.asList("Kharif", "Rabi", "Zaid");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        role = getIntent().getStringExtra("role");
        initViews();
        setupRecyclerView();
    }

    private void initViews() {
        recyclerView = findViewById(R.id.recyclerView);
        addCropBtn = findViewById(R.id.addCropBtn);
        logoutBtn = findViewById(R.id.logoutBtn);
        welcomeText = findViewById(R.id.welcomeText);

        welcomeText.setText("Welcome " + (role.equals("admin") ? "Admin" : "Farmer"));
        addCropBtn.setVisibility(role.equals("admin") ? View.VISIBLE : View.GONE);

        addCropBtn.setOnClickListener(v ->
                startActivity(new Intent(this, CropFormActivity.class)));

        logoutBtn.setOnClickListener(v -> {
            FirebaseAuth.getInstance().signOut();
            startActivity(new Intent(this, MainActivity.class));
            finish();
        });
    }

    private void setupRecyclerView() {
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(new SeasonAdapter(seasons, season -> {
            Intent intent = new Intent(DashboardActivity.this, CropListActivity.class);
            intent.putExtra("season", season.toLowerCase());
            intent.putExtra("role", role);
            startActivity(intent);
        }));
    }

    // Simple Season Adapter (inner class for minimal files)
    class SeasonAdapter extends RecyclerView.Adapter<SeasonAdapter.ViewHolder> {
        private List<String> seasons;
        private OnSeasonClick listener;

        public SeasonAdapter(List<String> seasons, OnSeasonClick listener) {
            this.seasons = seasons; this.listener = listener;
        }

        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = getLayoutInflater().inflate(R.layout.item_season, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            String season = seasons.get(position);
            holder.textView.setText(season);
            holder.itemView.setOnClickListener(v -> listener.onClick(season));

            // Sexy UI: Different colors for each season
            int[] colors = {0xFF4CAF50, 0xFFFF9800, 0xFF2196F3};
            holder.itemView.setBackgroundColor(colors[position % 3]);
        }

        @Override
        public int getItemCount() { return seasons.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView textView;
            ViewHolder(View itemView) { super(itemView); textView = itemView.findViewById(R.id.seasonName); }
        }
    }

    interface OnSeasonClick { void onClick(String season); }
}