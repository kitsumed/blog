---
title: 'Extracting TOTP Tokens From Microsoft Authenticator'
date: '2025-12-20T14:00:00-00:00'
tags: ["TOTP", "tutorial", "story", "Microsoft", "Android", "adb"]
comments: true # To show/hide comments
description: "Because you should be able to extract your own data. Learn how!" # Show Post Description under Title
---
**Hey! If you're here for the steps, [jump here](#what-you-need)**. Also, **if you have fewer than 10 accounts** and do not have a rooted phone (not rooted takes longer), **I highly recommend that you manually change your 2FA from your accounts settings**, as doing all of this will take more time. But anyway, enjoy your stay.

>[!WARNING]
>**Microsoft recently posted a really small hidden update on [their support site](https://web.archive.org/web/20251206045528/https://support.microsoft.com/en-us/account-billing/about-microsoft-authenticator-9783c865-0308-42fb-a519-8cf666fe0acc) that says** :
>
>"*Starting February 2026, **we will introduce Jailbreak/Root detection for work/school Entra credentials** in Microsoft Authenticator. This change enhances security by preventing Authenticator Entra credentials from functioning on jailbroken or rooted devices*".
>
>[I guess they really want you to be stuck with them](https://www.explainxkcd.com/wiki/index.php/2522:_Two-Factor_Security_Key)... I'm sure there will always be ways to extract TOTP tokens, maybe it will be harder or longer trought. Feel free to try it out and leave a command to tell other if it still works. **From my current understanding, it should still work**.
---

Recently, I have been revisiting, or should I say, creating a real disaster recovery plan for my data. While the first thing that comes to mind when thinking about recovery is disk storage, in today's world, online accounts and services from big (and small!) companies have taken a significant place in our daily lives, from entertainment to communications. As such, my disaster recovery plan also includes online account information, which also includes TOTP tokens, these small texts that allow TOTP to generate unique, temporary, valid authentication codes.

I have now been using Microsoft Authenticator for over 4 years. My main reason for using it at the time was its online backup feature. I was, of course, aware of open-source alternatives but was not confident enough at the time to take the risk of handling my own data. If I have to review Microsoft Authenticator, I would say that it is a nice app. It works well, and does exactly what it should be doing. However, they did recently remove password support to force users who used it to move over to Edge... Well, that's Microsoft for you. And at that very moment, I remembered that being dependent on a big company sure is easy, but they can screw you over without much consequence.

Losing access to the phone app for whatever reason means no longer having access to all of your accounts, and at this point, I had already seen a couple of user posts claiming that their Microsoft Authenticator restoration was not always working or took multiple days to work. [We'll get back to some of these posts later on](#story-time---why-did-the-restore-take-3-hours).

---

# What you need
Okay, so first and foremost, when I decided to extract those tokens, I was determined that I would not unlock my bootloader and root my phone. **You do not need a rooted phone**, but if your phone is, it will be faster (I'll give steps for the non-rooted phones approach. *If your phone is rooted, I will assume you are able to figure out which steps are relevant to you*).

**I did all of this on Windows 11**, it took around 20GB of space. From what I have seen online, you can also do it on Linux and MacOS.
Here's what you'll need:
1. [Android Studio](https://developer.android.com/studio) (For the Android Emulator. *If your phone is rooted, you do not need this*)
    * **Please see the Android emulator requirements**: https://developer.android.com/studio/run/emulator. You may need to **enable Virtualisation in your BIOS**.
2. [rootAVD](https://gitlab.com/newbit/rootAVD) (To root the emulated Android phone)
3. **Ensure you have enabled online backups on your Microsoft Authenticator app.**

# Let's begin
This part assumes you have installed Android Studio, enabled virtualisation, downloaded rootAVD, and completed the online backups.

### Android Studio
1. First, open the Android Device Emulator / Device Manager.

    ![Android Device Manager, Emulator](android-studio-virtual-device-manager.webp)
2. In the Android Device Manager, **create a new virtual device**. Personally, **I selected the Medium Phone type**.

    ![Create new virtual android device](device-manager-medium-phone.webp)
3. In the virtual device settings, select a version of Android supported by Microsoft Authenticator. I selected **Android 11 (API 30)**, as I have heard that rooting more recent versions with rootAVD can cause issues and involve more steps. **Also ensure that it includes Play Store services**, as you will need it to download Microsoft Authenticator from the Play Store.

    ![Android OS Version And API](device-configuration.webp)
4. Once all settings are configured, click on **Next/Finish**. Android Studio may ask you to accept new terms and download files. Once done, you should have your new virtual Android phone ready to start.
5. In your Android Device Manager window, next to your new virtual phone, press the **Play** button (it's an icon) to start the phone. Once the phone has started, follow the basic configuration steps and install the Microsoft Authenticator application. ***If you use the Play Store, you will need to connect a Google account***.

    ![Android Emulator Running](android-emulator-running.webp)

### Restoring TOTP code from Microsoft Authenticator
1. Inside the application, during its first setup, you need to press the **Restore from backup** button and connect your Microsoft account. ***If everything goes well***, it should take around 15 seconds. For me, it didn't, and it took me over 3 hours of trying and retrying, but [I'll talk about it later in this post](#story-time---why-did-the-restore-take-3-hours).

    ![Hit that restore button!](hit-restore.webp)

### Rooting the virtual phone
Alright! The phone is running, and Authenticator has restored a copy of your TOTP tokens. Now let's root your phone using **rootAVD**[^1].

1. Open a command prompt and set the rootAVD directory as its current location by using the `cd full-path` command.
2. Execute the batch file `rootAVD.bat` by typing `rootAVD.bat ListAllAVDs` in the console. You should see an output that looks similar to the following:
```text
Command Examples:
rootAVD.bat
rootAVD.bat ListAllAVDs
rootAVD.bat InstallApps

rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img
rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img FAKEBOOTIMG
rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img DEBUG PATCHFSTAB GetUSBHPmodZ
rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img restore
rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img InstallKernelModules
rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img InstallPrebuiltKernelModules
rootAVD.bat system-images\android-36.1\google_apis_playstore\x86_64\ramdisk.img InstallPrebuiltKernelModules GetUSBHPmodZ PATCHFSTAB DEBUG

rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img
rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img FAKEBOOTIMG
rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img DEBUG PATCHFSTAB GetUSBHPmodZ
rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img restore
rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img InstallKernelModules
rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img InstallPrebuiltKernelModules
rootAVD.bat system-images\android-33\google_apis_playstore\x86_64\ramdisk.img InstallPrebuiltKernelModules GetUSBHPmodZ PATCHFSTAB DEBUG

rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img
rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img FAKEBOOTIMG
rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img DEBUG PATCHFSTAB GetUSBHPmodZ
rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img restore
rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img InstallKernelModules
rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img InstallPrebuiltKernelModules
rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img InstallPrebuiltKernelModules GetUSBHPmodZ PATCHFSTAB DEBUG
```
3. Here, **we want to select the Android version of your currently running virtual phone**. I used Android 11, **API version 30**. This means my next command should be:

    `rootAVD.bat system-images\android-30\google_apis_playstore\x86\ramdisk.img`

>[!NOTE]
> If you see multiple errors saying **adb** is not recognized as an internal command, run `set PATH=%PATH%;%LOCALAPPDATA%\Android\sdk\platform-tools` and try again. I had this issue, it seems Android Studio did not register its bin path to my user environment variable.

4. **If you are asked to select a Magisk version, select the stable version.** If you have done everything right, wait 1-2 minutes and your virtual phone should close itself. **Keep that command prompt open, we will use it again.**

    ![Rooting the device](rooting-android-console.webp)

5. Once your virtual phone has closed itself or 2 minutes have passed, start it again and look for an application called **Magisk**. Open it and complete the setup. It may reboot the phone.

    ![Open and configure the Magisk application](look-for-magisk.webp)

### Exporting from Microsoft Authenticator
You're almost there! Just a few steps...

1. In the command prompt you previously used to root your virtual phone, run the command `adb shell` to establish a shell connection with the phone.
2. Inside that shell, elevate to root by typing `su`. **On the phone, you may see a popup from Magisk asking if you want to grant superuser permissions to the shell process. *You need to press Yes***. In the console, type `whoami`. If you see `root`, congratulations, you are now a superuser.
3. Now, we will use your superuser permissions to **copy the protected data of the Microsoft Authenticator application**. Copy them to a fake SD card **by running the command**: `cp -r /data/data/com.azure.authenticator/databases/ /sdcard/db_backup/`.
3. Good, now that we copied the protected data to a unprotected directory, we can exit the shell by writing `exit` two time. (*One to close the super-user shell, the other to exist the normal shell*)
4. Now, we need to pull a copy of the files in the virtual phone to our Windows machine. To do this, we can run `adb pull /sdcard/db_backup ./auth_databases_backup`. This will create a new directory inside our **rootAVD** directory called **auth_databases_backup**.
5. Inside that directory should be 3 files that starts with **PhoneFactor**. Inside your command prompt, write `sqlite3 .\auth_databases_backup\PhoneFactor`. You should see something that look like this :
    ```text
    Enter ".help" for usage hints.
    sqlite>
    ```
    Write the following `PRAGMA wal_checkpoint(TRUNCATE);` and do **Ctrl+C** two times to exit the sqlite shell.

>[!TIP]
> Doing the sqlite3 part might not be necessary, but since the database was in WAL (Write-Ahead Logging) mode, and I performed the restoration and extraction in quick succession, the DB file hadn't fully saved all changes to disk yet.

6. **You have successfully extracted your TOTP tokens!** For simplicity, here is a Python script[^2] that will parse your SQLite file and convert it into a text file. If you do not want to use Python, you can open the **PhoneFactor** file in any local SQLite viewer application.
    ```python
    import sqlite3

    # connect to sqlite3 database named PhoneFactor in current directory
    conn = sqlite3.connect('PhoneFactor')
    cursor = conn.cursor()

    # execute SQL query — only select account_type = 0
    cursor.execute("SELECT name, username, oath_secret_key FROM accounts WHERE account_type = 0")

    # open text file for writing
    with open("auth_accounts.txt", "w", encoding="utf-8") as f:
        # loop through each row
        for row in cursor.fetchall():
            name, username, secret_key = row
            # write to file
            f.write(f"Account: {name}\n")
            f.write(f"Username: {username}\n")
            f.write(f"Secret Token: {secret_key}\n")
            f.write("\n")  # blank line between entries

    # close database connection
    conn.close()

    print("Done - results saved to auth_accounts.txt")

    ```
    ![Phonefactor SQLite Viewer VS Code](phonefactor.webp)

>[!TIP]
> If you later want to uninstall Android Studio and/or fully remove the virtual device from your system, go to `C:\Users\%username%\.android\` and find the leftover files or remove everything if you uninstalled Android Studio. Upon looking, I also found leftover files after a supposed "full uninstallation" in other locations like `C:\Users\%username%\AppData\Roaming\Google\AndroidStudio2025.2.2`, `C:\Users\%username%\AppData\Local\Android`, `C:\Users\%username%\AppData\Local\Google\AndroidStudio2025.2.2`, and `C:\Users\%username%\AppData\Local\Temp\AndroidEmulator`. There was around 10GB of left-over files... Yep.

## Story Time - Why did the restore take 3 hours?

Alright, so I installed the Authenticator, pressed restore, and connected my account. *Pretty straightforward...* **Right??**

![Unable to recover](unable-to-recover.webp)

Well, it turns out it wasn't. I tried multiple things: fully clearing the app cache, uninstalling and reinstalling, deleting my backup and making a new one on my real phone, creating a new virtual phone, and more.

The error message didn't make much sense to me. No connection? I had just connected my Microsoft account successfully. How could I even do that without a connection? Even searching on Google worked.

So I searched online and found a couple of users, like in this [Reddit post](https://www.reddit.com/r/entra/comments/1ossj69/microsoft_authenticator_app_on_android_16_pixel/) or this [Microsoft Learn question](https://learn.microsoft.com/en-us/answers/questions/5615066/microsoft-authentificator-on-restore-check-your-in), who in recent months had the same issues. Most of these posts mentioned things I had already tried; some said you might need to do the restoration up to 10 times (didn't work), etc. At the end of the day, I stopped trying and figured it was probably a Microsoft-side bug, so I filed a bug report and, not too long after, went to sleep.

The next day, I tried again, and to no avail. The same error message, or in some cases, a popup that directly told me an unexpected error occurred. I continued to try a couple of things when I suddenly had a flash: what if the virtual phone was using the same DNS as my computer (an AdGuardHome server) and it was blocked? I hopped into my AdGuardHome admin panel and, sure enough, the first thing I saw was a completely new domain I had never seen before. From a quick search online, users who also blocked that domain (`mobile.pipe.aria.microsoft.com`) also had issues with other Microsoft services.

![AdguardHome](adguardhome-blocked.webp)

So what did I do? I booted the virtual phone, went into the WiFi settings, and set the Private DNS to `dns.adguard-dns.com`, effectively no longer using my local AdGuardHome. I tried a restore and boom everything worked under 15 seconds.

I guess... It's always the DNS.

## Credits
I would like to thank [chowder](https://gist.github.com/chowder/2ead734d60d84d4d15034fcce81aaaf9) on GitHub for his gists that showed me it was indeed possible. I have been searching about this online for a couple of weeks now, and most results claimed it was not possible using the application UI itself. I was sure there was a way, but did not know the Android ecosystem well enough to pull it off by myself. His gists gave me the basics and allowed me to search for the right things online. I figured out the rest.
[^1]: Used [this video](https://www.youtube-nocookie.com/embed/QzsNn3GhYYk) as a double check to ensure I was using rootAVD the right way.
[^2]: The Python script is inspired by [this short blog post](https://blog.jsfr.work/%E7%94%9F%E6%B4%BB%E8%AE%B0%E5%BD%95/Export-OTP-From-Microsoft-Authenticator.html) I discovered while doing this one.
