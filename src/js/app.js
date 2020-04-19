import Vue from 'vue'

// todo追加用コンポーネント
Vue.component('todo-creator', {
  props:['index'],
  data:function(){
    return {
      newTodoText:'',
      errMsg:''
    }
  },
  methods:{
    addItem: function(){
      if(this.newTodoText){
        let id = this.index + 1;
        let text = this.newTodoText;

        this.newTodoText = '';
        this.errMsg = '';
        this.$emit('add',id, text);
      } else {
        this.errMsg='入力が空です';
      }
    }
  },
  template:
    `<div>
      <div class="inputArea">
        <input type="text" class="inputText" v-model="newTodoText" placeholder="smothing todo task"
               v-on:keydown.enter.shift="addItem"/>
      </div>
        <span class="error" v-if="errMsg">{{errMsg}}</span>
      </div>`
})

// todo削除用コンポーネント
Vue.component('todo-delete', {
  props:['index'],
  methods:{
    deleteItem:function () {
      this.$emit('del',this.index);
    }
  },
  template:
  `<i class="fa fa-trash icon-trash" v-on:click="deleteItem" />`
})

// todo完了用コンポーネント
Vue.component('todo-done',{
  props:['index'],
  methods:{
    doneItem:function () {
      this.$emit('done',this.index);
    }
  },
  template:
  `<i class="fa fa-circle-thin icon-check" v-on:click="doneItem" />`
})

// todo編集用コンポーネント
Vue.component('todo-edit',{
  props:['item', 'index'],
  data:function(){
    return {
      tempItem: {
        id:this.item.id,
        text: this.item.text,
        isDone:this.item.isDone,
        isEdit:this.item.isEdit
      }
    }
  },
  methods:{
    editItem: function () {
      if(!this.item.isDone){
        this.tempItem.isEdit = true;
        this.focusItem();
      }
    },
    focusItem: function () {
      this.$refs.focusThis = [];
      this.$nextTick(function () {
        this.$refs.focusThis.select();
      })
    },
    editedItem: function () {
      this.tempItem.isEdit = false;
      this.$emit('edit',this.index, this.tempItem.text);
    }
  },
  template:
  `<div style="display:inline">
    <span v-on:dblclick="editItem" v-if="!tempItem.isEdit">{{this.item.text}}</span>
    <input ref="focusThis" type="text" class="editText" v-model="tempItem.text" v-if="tempItem.isEdit" v-on:keypress.enter="editedItem" @blur="editedItem">
  </div>`
})

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
      searchWord:''
    }
  },
  methods:{
    addItem: function(id, text){
      this.items.push({
        id,
        text,
        isDone:false,
        isEdit:false
      });
    },
    deleteItem: function (index) {
      this.items.splice(index, 1)
    },
    doneItem: function (index) {
      this.items[index].isDone = !this.items[index].isDone;
    },
    editItem: function (index, text) {
      this.$nextTick(function () {
        this.items[index].text = text;
      })
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
      <todo-creator v-bind:index="Object.keys(this.items).length" v-on:add="addItem"></todo-creator>
    </div>

    <div class="searchBox">
      <i class="fa fa-search searchBox__icon" aria-hidden="true" />
      <input type="text" class="searchBox__input" v-model="searchWord" />
    </div>

    <ul class="list">
      <li class="list__item" v-bind:class="{ 'list__item--done': item.isDone  }" v-for="(item, index) in searchItem">
        <todo-done v-bind:index="index" v-on:done="doneItem"></todo-done>
        <todo-edit v-bind:item="item" v-bind:index="index" v-on:edit="editItem"></todo-edit>
        <todo-delete v-bind:item="item" v-bind:index="index" v-on:del="deleteItem"></todo-delete>
      </li>
    </ul>
  </div>`
})
new Vue({el: '#app'})

