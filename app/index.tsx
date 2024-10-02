import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Button, FlatList, StatusBar, Text } from "react-native";

import { ProductDatabase, useProductDatabase } from "./database/useProductDatabase";

import { Input } from "@/components/Input";
import { Product } from "@/components/Product";

export default function Index() {

  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [produtos, setProdutos] = useState<ProductDatabase[]>([]);

  const productDatabase = useProductDatabase();

  const create = async () => {
    try {
      if (isNaN(Number(quantity))) {
        return Alert.alert("Atenção: A quantidade precisa ser um número!");
      }

      if (name === '' ||  name === null || name === undefined) {
        return Alert.alert("Preencha o campo Nome do Produto!");
      }

      if (quantity === '' ||  quantity === null || quantity === undefined) {
        return Alert.alert("Preencha o campo Quantidade!");
      }
      
      const response = await productDatabase.create({name, quantity: Number(quantity)});

      setName('');
      setQuantity('');

      Alert.alert("Produto Cadastrado com sucesso. ID: " + response.insertedRowId)
    } catch (error) {
      console.log(error);
      
    }
  }

  const list = async () => {
    try {
      const response = await productDatabase.searchByName(search);
      setProdutos(response);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const update = async () => {
    try {
      if (isNaN(Number(quantity))) {
        return Alert.alert("Quantidade: A quantidade precisa ser um número!");
      }
      const response = await productDatabase.update({id: Number(id), name, quantity: Number(quantity)});

      Alert.alert("Produto atulizado com sucesso.")
    } catch (error) {
      console.log(error);
      
    }
  }

  const details = ((item: ProductDatabase) => {
    setId(String(item.id))
    setName(item.name);
    setQuantity(String(item.quantity))
  })

  const handleSave = async () => {
    if (id) {
      update()
    } else {
      create();
    }

    setId('')
    setName('');
    setQuantity('');

    await list();
  }

  const remove = async (id: Number) => {
    try {
      await productDatabase.remove(id);

      Alert.alert("Produto removido com sucesso.")
      await list();
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    list()
  })

  return (
    <SafeAreaView style={{flex:1, justifyContent: "center", padding: 32, gap: 16 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Text style={{fontSize: 32 }}>Despensa na palma da mão</Text>
      <Input placeholder="Nome do produto" onChangeText={setName} value={name} />
      <Input placeholder="Quantidade" onChangeText={setQuantity} value={quantity} />
      <Button title="Salvar" onPress={handleSave}/>

      <Input placeholder="Pesquisar" onChangeText={setSearch} />

      <FlatList 
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({item}) => <Product data={item} onPress={() => details(item)} onDelete={() => remove(item.id)}/>}
        contentContainerStyle={{gap: 16}}        
        />
    </SafeAreaView>
  );
}
