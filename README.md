WMISoapBuilder
==============

Soap Note builder Mobile App for NOLS - Wilderness Medicine Institute. ionic/Angular/WebSQL

Environment Dependencies:
Fully set up ios, and android environments needed. In addition:
- node.js
- Grunt.js
 - npm install -g grunt-cli
 - npm install
- Bower.js
 - npm install -g bower
 - bower install
- Compass 
 - gem install compass
- Cordova
 - npm install cordova
 - npm update -g cordova
 
Install:
- git clone https://github.com/EyeByteSolutions/WMISoapBuilder.git
- cd WMISoapBuilder
- npm install
- bower install
- grunt build
- grunt platform:add:ios
- grunt platform:add:android

CLI Hints:
- grunt build - basic app build
- grunt serve:dist  -  will run in browser, once it boots up it will show ip
- grunt platform:add:ios, grunt platform:add:android add said platforms to project
- grunt build and then grunt emulate:iOS will open up xcode emulator
- grunt run:ios - runs app on ios connected device
- grunt run:android - runs on connected device, or genymotion emulator

Compiling for release (all):
- Change version in config.xml
- grunt build
- Change visible version in about template (app/templates/wmi/about)
- change android:versionCode= in platforms/android/AndroidManifest.xml

Compiling for iOS:
- Check info > bundle display name

Compiling release version for android:
- cordova build --release android
- cd into build folder (where apk is located | platforms/android/ant-build)
- jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore SOAPNotes-release-unsigned.apk alias_name
- delete any old version of SOAPNotes.apk, if present. Otherwise the following will fail.
- /Users/EBSrockyMtn/Development/adt-bundle-mac-x86_64-20140702/sdk/build-tools/21.1.1/zipalign -v 4 SOAPNotes-release-unsigned.apk SOAPNotes.apk

Hinges on the keystore. Needs to be the same! Password: Rogers200!!!
