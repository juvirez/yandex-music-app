const notarize = require('electron-notarize').notarize;
const path = require('path');

module.exports = async (params) => {
  try {
    const appleId = process.env.appleId;
    const appleASP = process.env.appleASP;

    if (!appleId || !appleASP) {
      console.log('skipped notarizing');
      return;
    }

    const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
    await notarize({
      appBundleId: 'dev.juvs.yandex-music',
      appPath,
      appleId: process.env.appleId,
      appleIdPassword: process.env.appleASP,
    });
  } catch (err) {
    console.error(err);
  }
};