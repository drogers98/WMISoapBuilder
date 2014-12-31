WMISoapBuilder
==============

Soap Note builder Mobile App for NOLS - Wilderness Medicine Institute. Angular/WebSQL

Dependencies:
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

Hints:
- grunt serve:dist  -  will run in browser, once it boots up it will show ip
- grunt build and then grunt emulate:iOS will open up xcode emulator

Compiling for release (all):
- Change version in config.xml
- grunt build
- Change visible version in about template
- change android:versionCode= in platforms/android/AndroidManifest.xml

Compiling release version for android:
- cordova build --release android
- cd into build folder (where apk is located | platforms/android/ant-build)
- jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore SOAPNotes-release-unsigned.apk alias_name
- delete any old version of SOAPNotes.apk, if present. Otherwise the following will fail.
- /Users/EBSrockyMtn/Development/adt-bundle-mac-x86_64-20140702/sdk/build-tools/21.1.1/zipalign -v 4 SOAPNotes-release-unsigned.apk SOAPNotes.apk

Hinges on the keystore. Needs to be the same! Password: Rogers200!!!
