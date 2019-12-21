package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.MediaController;
import android.widget.SearchView;
import android.widget.Switch;
import android.widget.Toast;
import android.widget.VideoView;
import androidx.appcompat.app.AppCompatActivity;

class MyWebViewClient extends WebViewClient {
    private final String schema = "sundial-dreams";
    private Context context;
    public MyWebViewClient(Context context) {
        this.context = context;
    }
    // 拦截Schema
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String schema = request.getUrl().getScheme();
        if (this.schema.equals(schema)) {
            String callback = request.getUrl().getQueryParameter("callback");
            String comment = request.getUrl().getQueryParameter("comment");
            assert comment != null;
            if (comment.equals("")) {
                Toast.makeText(context, "please type some comment!", Toast.LENGTH_LONG).show();
                return false;
            }
            // 使用loadUrl的方式来调用window上的方法
            view.loadUrl(String.format("javascript:%s('%s')", callback, comment));
        }
        return super.shouldOverrideUrlLoading(view, request);
    }

    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
    }
}
//javascript is best language in the world!
public class SecondActivity extends AppCompatActivity {
    private WebView webView;
    private SearchView searchView;
    private Switch aSwitch;
    private VideoView videoView;

    private final String host = "192.168.199.231";

    @SuppressLint({"SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_second);

        webView = findViewById(R.id.commentWebView);
        searchView = findViewById(R.id.searchView);
        aSwitch = findViewById(R.id.comment_switch);
        videoView = findViewById(R.id.videoView);

        videoView.setMediaController(new MediaController(this));
//        videoView.setVideoPath(Uri.parse("url").toString());
//        videoView.start();
//        videoView.requestFocus();

        aSwitch.setChecked(true);
        aSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            // Native调用JS，loadUrl 或者 evaluateJavascript
            webView.evaluateJavascript(String.format("DisplayCommentCard(%s)", isChecked), value -> {
                Toast.makeText(this, value, Toast.LENGTH_LONG).show();
            });
//            webView.loadUrl(String.format("javascript:DisplayCommentCard(%s)", isChecked));
        });

        webView.setWebViewClient(new MyWebViewClient(this));
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl(String.format("http://%s:3000/page_webview", host));
    }
}
