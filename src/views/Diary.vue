<template>
    <v-container fluid>
        <v-card>
          <v-toolbar dense flat color="primary" dark>
            <v-toolbar-title>일기장</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="editMode = !editMode">
              <v-icon>{{editMode ? 'mdi-eye' : 'mdi-pencil'}}</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="제목" v-model="diary.title"></v-text-field>
            <Editor v-if="editMode" ref="toastuiEditor" initialEditType="wysiwyg" />
            <Viewer v-if="!editMode && text != ''" :initialValue="diary.content"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="FileRead">FileRead</v-btn>
            <v-btn @click="FileWrite">FileWrite</v-btn>
            <v-btn @click="DBRead">DBRead</v-btn>
            <v-btn @click="DBWrite">DBWrite</v-btn>
          </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor, Viewer } from '@toast-ui/vue-editor'

const { dialog } = require('electron').remote
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../db/Diary.db', (err) => {
  if (err) {
    console.log(err.message)
    console.log('파일경로가 잘못되었나')
  }
  db.close((err) => {
    if (err) {
      console.log(err.message)
    }
  })
})

export default {
  components: {
    Editor,
    Viewer
  },
  created () {
  },
  data () {
    return {
      diary: {
        title: '',
        content: ''
      },
      editMode: true
    }
  },
  mounted () {
  },
  methods: {
    FileRead () {
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
      this.diary.content = fs.readFileSync(r[0]).toString()
      this.$refs.toastuiEditor.invoke('setHtml', this.diary.content)
    },
    FileWrite () {
      const options = {
        filters: [
          {
            //  파일 확장자 제한
            name: 'text and markdown',
            extensions: ['txt']
          }
        ]
      }
      this.diary.content = this.$refs.toastuiEditor.invoke('getHtml')
      const r = dialog.showSaveDialogSync(options)
      if (!r) return
      fs.writeFileSync(r, this.diary.content)
    },
    async DBRead () {
      console.log('DBRead')
    },
    async DBWrite () {
      console.log('DBWrite')
      this.diary.content = this.$refs.toastuiEditor.invoke('getHtml')
      console.log(this.diary.content)
      await db.run('CREATE TABLE `Diary` ( `contents` TEXT, `date` TEXT )', (err) => {
        if (err) {
          console.log(err)
        }
      })
      await db.run('INSERT INTO Diary title, content VALUES(' + this.diary.title + ', ' + this.diary.consont + ')', (err) => {
        if (err) {
          console.log(err)
        }
      })
      await db.close()
    }
  }
}
</script>
