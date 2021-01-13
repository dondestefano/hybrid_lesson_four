import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const search = require("./assets/search.png")
const close = require("./assets/close.png")
const confirm = require("./assets/confirm.png")

const Header = ({setFilterKeyWord}) => {
  const [searching, setSearching] = useState(false);
  return(
    <View style={styles.header}>
      {searching ? 
      <DefaultHeader setSearching={setSearching} searching={searching} /> 
      : 
      <SearchHeader setSearching={setSearching} searching={searching} setFilterKeyWord={setFilterKeyWord}/>
      }
    </View>
  )
}

const SearchHeader = ({setSearching, searching, setFilterKeyWord}) => {
  let keyword = ""

  const handleChangeText = (value) => {
    keyword = value
  }

  const filterData = () => {
    setFilterKeyWord(keyword);
  };

  const resetFilterData = () => {
    setFilterKeyWord("");
  }

  return(
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {{setSearching(!searching); resetFilterData()}}}
        activeOpacity={0.8}
        style={{alignItems: "center", justifyContent:"center"}}>
          <Image source={close} style={{width: 15, height: 15}}/>
      </TouchableOpacity>
      <TextInput style={{ padding: 8, backgroundColor: "#F2F2F2", textAlignVertical: 'top', width: 200}} placeholder="Search" onChangeText={handleChangeText} />
      <TouchableOpacity
        onPress={() => {filterData();}}
        activeOpacity={0.8}
        style={{alignItems: "center", justifyContent:"center"}}>
          <Image source={confirm} style={{width: 30, height: 30}}/>
      </TouchableOpacity>
    </View>
  )
}

const DefaultHeader = ({setSearching, searching}) => {
  return(
    <View style={styles.header}>
      <Text style={{fontSize: 20, fontWeight: "bold"}}>Youtube</Text>
      <TouchableOpacity
          onPress={() => {
            setSearching(!searching);
          }}
          activeOpacity={0.8}
          style={{alignItems: "center", justifyContent:"center"}}>
            <Image source={search} style={{width: 30, height: 30}}/>
      </TouchableOpacity>
    </View>
  )
}

const YoutubeList = ({data, setData, filterKeyWord}) => {
  const [shouldShow, setShouldShow] = useState(true);

  const fetchData = () => {
    fetch('https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=20&key=AIzaSyC0U9QWdWNITVbiO5NrgnkKPqMc1rxt4eI')
      .then((response) => response.json())
      .then((json) => {
        let dataResults = [];
        json.items.forEach((item) => {
          let result = { title: item.snippet.title, channel: item.snippet.channelTitle, imageUrl: item.snippet.thumbnails.standard.url };
          dataResults.push(result);
        });
        setData(dataResults);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      {shouldShow ? (<Button title="Fetch Data" onPress={() => {
        fetchData();
        setShouldShow(!shouldShow);
      }}/>) : null}

      <FlatList
        data={data.filter((item) => item.title.includes(filterKeyWord))}
        renderItem={({ item }) =>
        <View style={styles.videoView}>
          <Image source={{uri: item.imageUrl}} style={{width: "100%", height: 200}}/>
          <Text style={{fontSize: 18}}>{item.title}</Text>
          <Text style={{fontSize: 12, fontWeight: "bold"}}>{item.channel}</Text>
        </View>
        }
        keyExtractor={(item) => item.title.toString()}
      />
    </SafeAreaView>
  );
};

export default function App() {
  const [data, setData] = useState([]);
  const [filterKeyWord, setFilterKeyWord] = useState("");
  return (
    <View style={styles.container}>
      <Header data={data} setData={setData} setFilterKeyWord={setFilterKeyWord} />
      <YoutubeList data={data} setData={setData} filterKeyWord={filterKeyWord}/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },

  videoView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "flex-start",
    marginBottom: 25,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 70,
    alignItems:"center",
    marginVertical: 8,
    padding: 8,
  },
});