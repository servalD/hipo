import React, { useEffect, useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { TableCoProps, ICompanyFleet, IVehicle } from "../utils/types";
import axios from 'axios';

const deleteItem = async (type: String, id: string | null) => {
    try {
        await axios.delete(`http://localhost:3001/${type}/delete/${id}`);
    } catch (error) {
        console.error('Erreur lors de la suppression des données :', error);
    }
}
const hydrateItem = async (id: string) => {
    try {
        const response = await axios.get<IVehicle[]>('http://localhost:3001/vehicle/getById/'+ id);
        const data = response.data;

        if (data) {
            const vehicle:any = data;
            const modelInput = document.querySelector<HTMLInputElement>('.model_up');
            const brandInput = document.querySelector<HTMLInputElement>('.brand_up');
            const costInput = document.querySelector<HTMLInputElement>('.cost_up');
            const idInput = document.querySelector<HTMLInputElement>('.id_up');

            if (modelInput) modelInput.value = vehicle.model;
            if (brandInput) brandInput.value = vehicle.brand;
            if (idInput) idInput.value = "_id" in vehicle ? vehicle._id : "";
            if (costInput) costInput.value = String(vehicle.cost);
        } else {
            console.error('Aucune donnée reçue pour hydrater l\'élément.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

const hydrateItemCom = async (id: string) => {
    try {
        const response = await axios.get<ICompanyFleet[]>('http://localhost:3001/company/getById/'+ id);
        const data = response.data;
        if (data) {
            const Company:any = data;
            const nameInput = document.querySelector<HTMLInputElement>('.company_name');
            const idInput = document.querySelector<HTMLInputElement>('.id_up');

            if (nameInput) nameInput.value = Company.name;
            if (idInput) idInput.value = "_id" in Company ? Company._id : "";
        } else {
            console.error('Aucune donnée reçue pour hydrater l\'élément.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


function TableCo(props: TableCoProps) {
    const [data, setData] = useState<ICompanyFleet[] | IVehicle[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<ICompanyFleet[] | IVehicle[]>(`http://localhost:3001/${props.type}/get`);
                setData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, [props.type]);
    return (
        props.type === "company" ?
            <TableContainer>
                <Table size='lg'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Vehicle</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item, index) => (
                            <Tr key={index} onClick={() => hydrateItemCom("_id" in item ? item._id+ "" : null+"")}>
                                <Td>{"name" in item ? item.name : null}</Td>
                                <Td>{"IVehicle" in item ? item.IVehicle : null}</Td>
                                <Td>
                                    <Button colorScheme='blue' onClick={() => {
                                        if ("_id" in item && typeof item._id === 'string') {
                                            deleteItem(props.type, item._id);
                                        }
                                    }}
                                    >Delete</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            :
            <TableContainer>
                <Table size='lg'>
                    <Thead>
                        <Tr>
                            <Th>Model</Th>
                            <Th>Brand</Th>
                            <Th>Cost</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item, index) => (
                            <Tr key={index} className={"_id" in item ? item._id+ "" : null+""} onClick={() => hydrateItem("_id" in item ? item._id+ "" : null+"")}>
                                <Td>{"model" in item ? item.model : null}</Td>
                                <Td>{"brand" in item ? item.brand : null}</Td>
                                <Td>{"cost" in item ? item.cost : null}</Td>
                                <Td>
                                    <Button colorScheme='blue' onClick={() => {
                                        if ("_id" in item && typeof item._id === 'string') {
                                            deleteItem(props.type, item._id);
                                        }
                                    }}
                                    >Delete</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

    );
}


export default TableCo;
