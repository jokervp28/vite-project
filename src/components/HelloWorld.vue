<template>
  <v-app id="app">
    <v-main style="background: white; border-radius: 5px">
      <v-container id="app" fluid>
        <v-toolbar style="background: white; border-radius: 5px">
          <v-toolbar-title style="max-width: 100px" align="left">
            My Tasks
          </v-toolbar-title>
          <v-divider class="ma-2" inset vertical/>
          <v-text-field
            v-model="searchValue"
            label="Search"
            class="shrink ml-auto"
            align="center"
            single-line
            hide-details/>
          <v-divider class="ma-2" inset vertical/>
          <v-btn
            align="right"
            color="primary"
            text
            @click="newTask">
            New Task
          </v-btn>
        </v-toolbar>
      </v-container>
      <div class="text-center">
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-textarea
                      v-model="editedTask.desc"
                      label="Task Description"
                      required/>
                  </v-col>
                </v-row>
                <v-row v-if="!(this.editedIndex === -1)">
                  <v-col>
                    <label><input type="checkbox" v-model="editedTask.completed"> <span>Task Completed</span></label>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn
                color="primary"
                text
                @click="cancelTask">
                Cancel
              </v-btn>
              <v-btn
                :disabled="!(editedTask.desc)"
                color="primary"
                text
                @click="saveTask(item)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-container style="min-width: 500px" fluid class="mt-n3">
        <v-divider/>
        <EasyDataTable
          :search-field="searchFields"
          :search-value="searchValue"
          :headers="headers"
          :items="tasksList"
          :sort-by="sortBy"
          :sort-type="sortType"
          buttons-pagination>
          <template #item-completed="item">
            <input type="checkbox" onclick="return false" v-model="item.completed"/>
          </template>
          <template #item-action="item">
            <div class="operation-wrapper">
              <img
                src="./images/delete.png"
                class="operation-icon"
                @click="deleteTask(item)"
              />
              <img
                src="./images/edit.png"
                class="operation-icon"
                @click="editTask(item, false)"
              />
            </div>
          </template>
        </EasyDataTable>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      searchFields: ['id', 'desc'],
      searchValue: '',
      sortBy: 'completed',
      sortType: 'asc',
      dialog: false,
      maxId: 0,
      tasksList: [],
      tasksList1: [
        { id: '1', desc: 'task 1', completed: false },
        { id: '2', desc: 'task 2', completed: true },
        { id: '3', desc: 'task 3', completed: false }
      ],
      headers: [
        { text: 'Task ID', value: 'id', sortable: true },
        { text: 'Task Description', value: 'desc', sortable: true },
        { text: 'Completed', value: 'completed', sortable: true },
        { text: 'Action', value: 'action', width: 60 }
      ],
      editedIndex: -1,
      editedTask: {
        'id': '-1',
        'desc': '',
        'completed': false
      },
      defaultTask: {
        'id': '-1',
        'desc': '',
        'completed': false
      }
    }
  },
  mounted() {
    if (localStorage.getItem('tasksList')) {
      try {
        this.tasksList = JSON.parse(localStorage.getItem('tasksList'));
        this.maxId = 0
        for (const task of this.tasksList) {
          if (Number(task.id) > this.maxId) {
            this.maxId = Number(task.id)
          }
        }
      } catch(e) {
        alert('Ошибка при загрузке данных');
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.editedIndex === -1 ? 'New Task' : 'Edit Task (ID=' + this.editedTask.id + ')'
    }
  },
  methods: {
    newTask () {
      this.editedIndex = -1
      this.editedTask = Object.assign({}, this.defaultTask)
      this.dialog = true
    },
    editTask (item) {
      this.editedIndex = this.tasksList.findIndex((task) => task.id === item.id)
      this.editedTask = Object.assign({}, item)
      this.dialog = true
    },
    deleteTask (item) {
      if (confirm('Are you sure you want to delete this task?')) {
        this.tasksList.splice(this.tasksList.findIndex((task) => task.id === item.id), 1)
        this.saveData()
      }
    },
    cancelTask () {
      this.editedIndex = -1
      this.editedTask = Object.assign({}, this.defaultTask)
      this.dialog = false
    },
    saveTask () {
      if (this.editedIndex === -1) {
        this.maxId = this.maxId + 1
        this.tasksList.push({ id: this.maxId, desc: this.editedTask.desc })
      }
      else {
        const task = this.tasksList.find((task) => task.id === this.editedTask.id)
        task.desc = this.editedTask.desc
        task.completed = this.editedTask.completed
      }
      this.saveData()
      this.dialog = false
    },
    saveData () {
      try {
        localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
      } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
          alert('Превышен лимит');
        } else {
          alert('Ошибка при записи данных');
        }
      }
    }
  }
}
</script>

<style>
.operation-wrapper .operation-icon {
  width: 20px;
  cursor: pointer;
}
</style>
