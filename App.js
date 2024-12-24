import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [taskText, setTaskText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    saveTasks()
  }, [tasks])

  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks')
    if (storedTasks) setTasks(JSON.parse(storedTasks))
  }

  const saveTasks = async () => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
  }

  const addTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }])
      setTaskText('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'incomplete') return !task.completed
    return true
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Задача"
        value={taskText}
        onChangeText={setTaskText}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Добавить</Text>
      </TouchableOpacity>
      <View style={styles.filters}>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={[styles.filterButton, filter === 'all' && styles.activeFilter]}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('completed')}>
          <Text style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}>
            Выполнены
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('incomplete')}>
          <Text style={[styles.filterButton, filter === 'incomplete' && styles.activeFilter]}>
            Не выполнены
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedTaskText
              ]}
              onPress={() => toggleTask(item.id)}
            >
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  filterButton: {
    fontSize: 16,
    padding: 5,
    color: '#555'
  },
  activeFilter: {
    color: '#000',
    fontWeight: 'bold'
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  taskText: {
    fontSize: 16
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#aaa'
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold'
  }
})