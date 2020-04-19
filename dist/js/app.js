import Vue from 'vue'

Vue.component('todo-list', {
  data: function () {
    return {
      items: [
        {
          id:1,
          text: 'sample text1',
          isDone: false,
          isEdit: false
        },
        {
          id:2,
          text: 'sample text2',
          isDone: false,
          isEdit: false
        }
      ],
      errMsg:'',
      newTodoText:'',
      searchWord:''
    }
  },
  methods:{
    addItem: function(){
      if(this.newTodoText){
        this.items.push({
          id: Object.keys(this.items).length,
          text: this.newTodoText,
          isDone: false,
          isEdit: false
        });
        this.errMsg='';
        this.newTodoText='';
      } else {
        this.errMsg='入力が空です';
      }
    },
    deleteItem: function (item) {
      let index = this.items.indexOf(item);
      this.items.splice(index, 1)
    },
    doneItem: function (item) {
      let index = this.items.indexOf(item);
      this.items[index].isDone = !this.items[index].isDone;
    },
    editItem: function (item) {
      let index = this.items.indexOf(item);
      if(!this.items[index].isDone){
        this.changeEditStatus(index);
        this.focusItem();
      }
    },
    focusItem: function () {
      this.$refs.focusThis = [];
      this.$nextTick(function () {
        this.$refs.focusThis[0].select();
      })
    },
    editedItem: function (item) {
      let index = this.items.indexOf(item);
      this.items[index].text = item.text;
      this.changeEditStatus(index);
    },
    changeEditStatus:function (index) {
      this.items[index].isEdit = !this.items[index].isEdit;
    }
  },
  computed: {
    searchItem:function () {
      let regexp = new RegExp('^' + this.searchWord + '[a-zA-Z0-9]*');  // 検索条件（前方一致）を定義
      let data = this.items;  // 現在のオブジェクトを保存
      if (this.searchWord){ // 検索フォームに入力があった場合
        data = this.items.filter(function (item) {  // 前方一致でヒットしたオブジェクトを配列に格納する
          return item.text.match(regexp)
        })
      }
      return data   // ヒットしたもののみが格納された配列を返す
    }
  },
  template:
      `<div>
        <div class="form">
          <div class="inputArea">
            <input type="text" class="inputText" v-model="newTodoText" placeholder="smothing todo task"
                v-on:keydown.enter.shift="addItem"/>
          </div>
          <span class="error" v-if="errMsg">{{errMsg}}</span>
        </div>

        <div class="searchBox">
          <i class="fa fa-search searchBox__icon" aria-hidden="true" />
          <input type="text" class="searchBox__input" v-model="searchWord" />
        </div>

        <ul class="list">
          <li class="list__item" v-bind:class="{ 'list__item--done': item.isDone  }" v-for="(item, index) in searchItem">
            <i class="fa fa-circle-thin icon-check" v-on:click="doneItem(item)" />
            <span v-on:dblclick="editItem(item)" v-if="!item.isEdit">{{item.text}}</span>
            <input ref="focusThis" type="text" class="editText" v-model="item.text" v-if="item.isEdit" v-on:keypress.enter="editedItem(item)" @blur="changeEditStatus(index)">
            <i class="fa fa-trash icon-trash" v-on:click="deleteItem(item)" />
          </li>
        </ul>
      </div>`
})
new Vue({el: '#app'})

