# Add feedback prompt in Settings tab

!!! info "This feature requires you to [register your app as a service](index.md) first."

For developer who want to add feedback feature, the app provides a API to show a feed link in settings page:

First, register service with `feedbackPath`:

```js
document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage({
  type: 'rc-adapter-register-third-party-service',
  service: {
    name: 'TestService',
    feedbackPath: '/feedback',
  }
}, '*');
```

After registering, you can get feedback link in settings page:

![feedback](https://user-images.githubusercontent.com/7036536/218915001-89425b0f-9276-42cc-9d85-a810f69939c0.png)

Add a message event to listen feedback link click event and handle that:

```js
window.addEventListener('message', function (e) {
  var data = e.data;
  if (data && data.type === 'rc-post-message-request') {
    if (data.path === '/feedback') {
      
      // response to widget
      document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage({
        type: 'rc-post-message-response',
        responseId: data.requestId,
        response: { data: 'ok' },
      }, '*');
      // add your codes here to show your feedback form
      console.log(data);
    }
  }
});
```

## Add feedback button at header

You can also add a feedback button at header, this way doesn't require to register service:

<!-- md:version 1.10.0 -->

```js
RCAdapter.showFeedback({
  onFeedback: function () {
    // add your codes here to show your feedback form
  },
});
```
