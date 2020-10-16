<template>
    <v-container fluid>
        <v-card>
          <v-toolbar dense flat>
            <v-toolbar-title>문서편집기</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-textarea v-model="text"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="read">read</v-btn>
            <v-btn @click="write">write</v-btn>
          </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
const { dialog } = require('electron').remote
const fs = require('fs')
export default {
  data () {
    return {
      text: ''
    }
  },
  mounted () {
    console.log(dialog)
  },
  methods: {
    read () {
      const options = {
        filters: [
          {
            //  파일 확장자 제한
            name: 'text and markdown',
            extensions: ['txt']
          }
        ]
      }
      const r = dialog.showOpenDialogSync(options)
      if (!r) return
      this.text = fs.readFileSync(r[0])
    },
    write () {
      const options = {
        filters: [
          {
            //  파일 확장자 제한
            name: 'text and markdown',
            extensions: ['txt']
          }
        ]
      }
      const r = dialog.showSaveDialogSync(options)
      if (!r) return
      fs.writeFileSync(r, this.text)
    }
  }
}
</script>
