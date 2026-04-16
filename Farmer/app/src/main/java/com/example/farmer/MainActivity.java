package com.example.farmer;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.*;

public class MainActivity extends AppCompatActivity {
    private EditText emailET, passwordET, nameET;
    private Button loginBtn;  // 👈 Only one button
    private LinearLayout registerLayout;
    private FirebaseAuth mAuth;
    private DatabaseReference mDatabase;
    private boolean isRegisterMode = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mAuth = FirebaseAuth.getInstance();
        mDatabase = FirebaseDatabase.getInstance().getReference();

        initViews();
        setupListeners();

        // Check if already logged in
        if (mAuth.getCurrentUser() != null) {
            checkUserRoleAndNavigate(mAuth.getCurrentUser().getUid());
        }
    }

    private void initViews() {
        emailET = findViewById(R.id.emailET);
        passwordET = findViewById(R.id.passwordET);
        nameET = findViewById(R.id.nameET);
        loginBtn = findViewById(R.id.loginBtn);  // 👈 Only this button
        registerLayout = findViewById(R.id.registerLayout);
    }

    private void setupListeners() {
        TextView toggleMode = findViewById(R.id.toggleMode);
        toggleMode.setOnClickListener(v -> {
            isRegisterMode = !isRegisterMode;
            registerLayout.setVisibility(isRegisterMode ? View.VISIBLE : View.GONE);
            loginBtn.setText(isRegisterMode ? "Register" : "Login");
            toggleMode.setText(isRegisterMode ? "Already have account? Login" : "New user? Register");
        });

        loginBtn.setOnClickListener(v -> {
            if (isRegisterMode) register();
            else login();
        });
    }

    private void login() {
        String email = emailET.getText().toString().trim();
        String password = passwordET.getText().toString().trim();

        if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
            Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        mAuth.signInWithEmailAndPassword(email, password)
                .addOnSuccessListener(authResult ->
                        checkUserRoleAndNavigate(authResult.getUser().getUid()))
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Login failed: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }

    private void register() {
        String email = emailET.getText().toString().trim();
        String password = passwordET.getText().toString().trim();
        String name = nameET.getText().toString().trim();

        if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password) || TextUtils.isEmpty(name)) {
            Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        mAuth.createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener(authResult -> {
                    String uid = authResult.getUser().getUid();
                    User user = new User(uid, name, email, "user");
                    mDatabase.child("users").child(uid).setValue(user)
                            .addOnSuccessListener(aVoid -> checkUserRoleAndNavigate(uid));
                })
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Registration failed: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }

    private void checkUserRoleAndNavigate(String uid) {
        mDatabase.child("users").child(uid).child("role").get()
                .addOnSuccessListener(dataSnapshot -> {
                    String role = dataSnapshot.getValue(String.class);
                    Intent intent = new Intent(MainActivity.this, DashboardActivity.class);
                    intent.putExtra("role", role != null ? role : "user");
                    startActivity(intent);
                    finish();
                });
    }

    // Simple User class
    public static class User {
        public String uid, name, email, role;
        public User() {}
        public User(String uid, String name, String email, String role) {
            this.uid = uid; this.name = name; this.email = email; this.role = role;
        }
    }
}