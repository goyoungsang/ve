<template>
    <v-container fluid>
        <v-card>
          <v-toolbar dense flat color="primary" dark>
            <v-toolbar-title>문서편집기</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="editMode = !editMode">
              <v-icon>{{editMode ? 'mdi-eye' : 'mdi-pencil'}}</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <Editor v-if="editMode" ref="toastuiEditor" initialEditType="wysiwyg" v-model="text"/>
            <Viewer v-if="!editMode && text != ''" :initialValue="text"/>
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
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor, Viewer } from '@toast-ui/vue-editor'

const { dialog } = require('electron').remote
const fs = require('fs')

export default {
  components: {
    Editor,
    Viewer
  },
  data () {
    return {
      text: '',
      editMode: true
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
      this.text = fs.readFileSync(r[0]).toString()
      console.log(this.text)
      this.$refs.toastuiEditor.invoke('setHtml', this.text)
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
      console.log('---------')
      console.log(this.text)
      console.log(this.$refs.toastuiEditor.invoke('getHtml'))
      console.log('---------')
      this.text = this.$refs.toastuiEditor.invoke('getHtml')
      const r = dialog.showSaveDialogSync(options)
      if (!r) return
      fs.writeFileSync(r, this.text)
    }
  }
}
</script>
