package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;



public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private final String host = "192.168.199.231";

    public class InjectNativeObject { // 注入到JavaScript的对象
        private Context context;
        public InjectNativeObject(Context context) {
            this.context = context;
        }
        @JavascriptInterface
        public void openNewPage(String msg) { // 打开新页面
            if (msg.equals("")) {
                Toast.makeText(context, "please type!", Toast.LENGTH_LONG).show();
                return;
            }
            startActivity(new Intent(context, SecondActivity.class));
            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void quit() {
            finish();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.loginWebView);
        webView.getSettings().setJavaScriptEnabled(true);
        // JS注入
        webView.addJavascriptInterface(new InjectNativeObject(this), "NativeBridge");
        webView.loadUrl(String.format("http://%s:3000/login_webview", host));
    }

}
