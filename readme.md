Byaz Calculator

Ledger for money you lent (Lender) or money you borrowed (Customer), with per-day simple interest. Hindi and English, works offline. The Lender / Customer switch is at the top. All data is saved on the phone (localStorage). Use the Backup button to keep a copy.

Files
index.html the whole app (HTML, CSS, JS in one file)
manifest.json name, colours and icons so the phone can install it
sw.js service worker, makes it open without internet
icon-192.png, icon-512.png app icons
Try it on your computer

Service workers need a web server (opening the file directly will not install it):

cd byaz-app
python3 -m http.server 8000

Open http://localhost:8000 in Chrome.

Put it on your phone (free)
Create a GitHub repository and upload these files to the root.
Repository Settings > Pages > Deploy from branch main, folder / (root).
Open the https://USERNAME.github.io/REPO/ link in Chrome on your phone.
Menu (three dots) > Install app, or Add to Home screen.

Netlify or Cloudflare Pages work the same way (drag the folder in).

Updating the app

After you change index.html, edit CACHE_VERSION in sw.js (for example byaz-v2). Phones then pick up the new version the next time they open the app.

Make an Android APK (optional)

Needs Node.js and Android Studio.

npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init Byaz com.example.byaz --web-dir=www
mkdir www
cp index.html manifest.json sw.js icon-192.png icon-512.png www/
npx cap add android
npx cap sync
npx cap open android

In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s). Copy the APK to your phone and install it. Run npx cap sync again after each change to the files in www/.

How interest is calculated
Every "lent" entry is its own loan with its own rate (% per month = rate / 30 per day, % per year = rate / 365 per day).
Interest is simple: principal x daily rate x days. Days run from one entry date to the next (1 Aug to 3 Aug = 2 days).
Unpaid interest does not earn interest. Each period is rounded to the nearest paisa.
Money received goes to the oldest loan first. Default order is pending interest, then principal (changeable per person).
The calculation is the compute() function inside index.html (between the CALC-START and CALC-END comments). It has no dependencies, so you can copy it into any other language.
Moving data to another phone

Backup > Download backup file, send the file to the other phone, open the app there, Backup > Load backup file > Restore from text.