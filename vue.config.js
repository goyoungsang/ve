module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appID: 'com.ve.app',
        nsis: {
          createDesktopShortcut: true
        }
      }
    }
  }
}
