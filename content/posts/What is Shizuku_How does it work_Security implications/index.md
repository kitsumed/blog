---
title: 'What Is Shizuku? How Does It Work? Security Implications?'
date: '2026-01-30T12:00:00-05:00'
tags: ["Android","adb","Shizuku"]
comments: true
description: "Learn about Shizuku, how it works, and some of the security implications that comes with it!"
searchHidden: false
hidemeta: false
---
# What is Shizuku?
Shizuku is an Android application whose goal is to give other applications the ability to obtain root-like permissions with the help of ADB (it also supports rooted devices), via the [Android Debug Bridge](https://developer.android.com/tools/adb).

ADB, being a tool meant to test and debug applications and the Android OS in general, provides a more accessible alternative for users who wish to customise their device but do not, or cannot, due to OEM restrictions on their bootloader and the issues that comes with rooted devices. ADB provides a more accessible alternative.

Early versions of ADB required the device to have USB debugging enabled and to be physically connected to a computer. This meant that at some point, you always **needed to be near a computer** in order to run ADB commands. However, starting with Android 11, ADB gained support for wireless connections, **allowing remote access from devices on the same WiFi network**. While this removed the USB requirement, it still required a computer to be present on the same network.

This is where Shizuku comes into play. Since Shizuku runs directly on the device with its own ADB client, it cannot use USB connections. However, with the introduction of Wireless ADB, Shizuku can act as the "computer" by connecting to the device itself using the loopback IP address `127.0.0.1`. This means you no longer need a computer to run ADB commands.

Shizuku's role can be summarised as a manager: it establishes an ADB connection, keeps it alive, and, upon requests from third-party applications, executes commands within that shell. *(With a list of authorized applications, of course!)*

However, this approach also comes with downsides. ADB has fewer permissions than a shell running as a superuser, which limits what can be done. Regardless, it remains very powerful, far more than what is possible through the standard device interface.

# How does it works, exactly?
This is a more detailed, yet still simplified explanation of how the application works, along with some of the security implications that come with it. It focus on the ADB mode of Shizuku, but root mode should work in a similar manner, without the ADB requirements. Also note that I'm not a security expert, I just read the code and tested it, noted my observations.

These explanations are based on the most popular [fork of Shizuku made by thedjchi](https://github.com/thedjchi/Shizuku), as the original Shizuku application no longer appears to be actively maintained with new features. The original version should still share the same core mechanisms.

### What happen when you run Shizuku for the first time
1. The user must enable **USB Debugging** and **Wireless Debugging** manually to allow Shizuku to connect to the device using ADB.
2. Shizuku will then guide the user in the Wireless Debugging pairing process so it is allowed to connect. This is a one-time process. The pairing process (with code) should no longer be necessary afterward.
3. Once paired, Shizuku will grant itself the **WRITE_SECURE_SETTINGS** permission,  once it has successfully connected to ADB, it will use the **WRITE_SECURE_SETTINGS** permission to disable **Wireless Debugging**.

### What happens at every subsequent use:
1. Shizuku already has the **WRITE_SECURE_SETTINGS** permission.
2. It checks if **USB Debugging** is enabled. If not, it enables it to allow and maintain alive the future ADB connection.
3. It enables **Wireless Debugging**, connects via ADB, and then disables **Wireless Debugging** again.

## The general security implications

1. Shizuku must enable **Wireless Debugging** to initiate a connection to the device itself (`127.0.0.1`). However, as soon as the connection is established, it disables **Wireless Debugging**. This prevents new connections while keeping ongoing ones alive.
    - This leaves a very short window where other clients could attempt to connect to the device. However, this is unlikely to be critical, as pairing with a code displayed on your device is required the first time.
  
2. Shizuku grants itself the **WRITE_SECURE_SETTINGS** permission, which allows it to edit almost all of the settings on your device, including **USB Debugging** and **Wireless Debugging**.
    - This permission is considered critical and, by default, can only be used by system applications.
    - It is required for Shizuku to operate more easily and, in some cases, more securely. However, it could allows Shizuku to establish an ADB connection whenever it wants.
    - That said, the ADB connection itself grants way more permissions than **WRITE_SECURE_SETTINGS**.

3. Shizuku enables **USB Debugging** on your device, which reduces its security, mostly on a physical level, regardless of whether the device is locked or not. CVEs and zero-day exploits exist, and having ADB enabled increases the risk of exploitation.
    - **Note**: For a on-going ADB connection to stay alive, **USB Debugging** must remain enabled, regardless of how the connection was initiated.
    - As of the time of review, Shizuku does not disable **USB Debugging** once its ADB connection is closed. I have created an issue about this [here](https://github.com/thedjchi/Shizuku/issues/110). The suggestion is that Shizuku should enable **USB Debugging** when needed and turn it off when it is not.

## Features: Security Implications
After creating an issue in the repo, a shorter, more detailed description of the features was added to the [wiki](https://github.com/thedjchi/Shizuku/wiki#features). I won't be explaning all of the features, but a few are worth mentioning from a security perspective. Since the time of writing this, more feature with security implications may also exist.

1. **Integration with automation apps**: Shizuku makes use of **intents** to allow third-party automation applications to send start and stop requests that initiate or terminate an ADB connection. This is useful for users who want to automatically start or close Shizuku.
    - As of writing, there is no way to disable or apply any restrictions to these requests. This could potentially be exploited by an app to force **USB Debugging** and **Wireless Debugging** to be enabled. While this is not necessarily dangerous in itself, it does open the door to additional risks. An issue was created [here](https://github.com/thedjchi/Shizuku/issues/111), and discussions about implementing an on/off system have started.

2. **TCP mode**: TCP mode, often called `ADB over TCP/IP`, is the legacy "wireless" debugging mode of ADB. In short, it was implemented in early versions of Android and uses the `adb tcpip` command. Prior to Android 11, where **Wireless ADB** was introduced, you needed to be physically connected to the device to enable **ADB over TCP/IP**.

    At the time of **ADB over TCP/IP**, no first-time pairing code was required. When a device wanted to connect, a popup with **Yes** and **No** would appear on the target device. Additionally, **ADB over TCP/IP** does not use TLS (traffic was send in plain text).
    
    Starting with Android 11, **Wireless ADB** simplified the process and made it safer. You no longer needed a physical connection, there was a first-time pairing code, and traffic was now encrypted using TLS!

    But there's a catch, of course. To enable **Wireless ADB**, the device must be connected to a WiFi network. This is why the legacy **TCP mode** was added, it doesn't require your device to be connected to a WiFi network. You can learn more about the differences by reading the Android Docs [here](https://android.googlesource.com/platform/packages/modules/adb/+/HEAD/docs/dev/adb_wifi.md).
    - This means that traffic between your device and its loopback (`127.0.0.1`) is **transmitted in plain text**. While this isn't ideal, at least the traffic stays on your device.
    - **However**, any external devices that can reach your device via **ADB over TCP/IP** can initiate a connection request. If you accidentally press **Yes** to the popup, congratulations, you've just **granted ADB access to an unknown device**.
    - Contrary to **Wireless ADB**, you cannot disable **ADB over TCP/IP** once Shizuku established a connection. In fact, to disable **ADB over TCP/IP**, you must **reboot the device**.

# Conclusion
If you only need to run a few ADB commands, you're probably better off installing a terminal app like [Termux](https://github.com/termux/termux-app) along with the ADB client. That said, I do really like the idea of Shizuku, as it provides root-like access to applications on your device without actually rooting it. While it does put your device in a more vulnerable state, mostly physically while Shizuku is running. It's great for customization, but also for privacy (debloating, removing permissions, etc.).

I also believe Shizuku may soon see a new influx of users. As Android is owned by Google, it suffers from many of the same issues as most products from companies in monopoly situation.

For example, starting this year, 2026, Google will begin [restricting sideloading](https://android-developers.googleblog.com/2025/11/android-developer-verification-early.html) and will require developers to verify their identity, even for apps outside of the Play Store. In other words, **heavily restricting the installation** of applications that were not specifically **allowed by the Play Store terms**, made and **managed by Google**, while requiring **more of your personal information** (and even **money** in some cases!) so you can install **your own app on a device you own**. *All in the name of keeping users safe from scam call-center in Southeast Asia!*

In the same [FAQ](https://developer.android.com/developer-verification/guides/faq), they also mentioned that if you want to install apps without these restrictions, you'll have to use ADB going forward.

Here's my closing thought: I can't wait to see how they'll justify disabling loopback **ADB over TCP/IP** connections on non-emulator devices and start requiring a Google account to make "secure" **Wireless ADB** connections. *This is satire, if you didn't get it.* I hope Shizuku will live for a long time.