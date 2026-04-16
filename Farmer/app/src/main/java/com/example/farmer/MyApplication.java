package com.example.farmer;

import android.app.Application;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.FirebaseDatabase;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        // Initialize Firebase (optional - usually automatic)
        FirebaseApp.initializeApp(this);

        // Enable offline persistence for Realtime Database
        FirebaseDatabase.getInstance().setPersistenceEnabled(true);
    }
}