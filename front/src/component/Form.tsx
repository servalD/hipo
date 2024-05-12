import React, { useEffect, useState } from 'react';
import {FormControl, FormLabel, Input, Button, Stack} from '@chakra-ui/react';
import Select from 'react-select';
import axios from "axios";
import { ICompanyFleet, IVehicle, TableCoProps } from "../utils/types";
import {Radio} from "@mui/material";
import { config } from "dotenv";

const getVehicle = async (): Promise<IVehicle[]> => {
    try {
        const response = await axios.get<IVehicle[]>(`http://${process.env.REACT_APP_IP}:3001/vehicle/get`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return [];
    }
}

const addCompany = async () => {
    try {
        const nameInput = document.querySelector<HTMLInputElement>('.company_name_i');
        const ccbInput = document.querySelectorAll<HTMLInputElement>('.cb');
        if(nameInput && ccbInput){
            let name = nameInput.value;
            let IVehicle: string[] = [];
            for (let i = 0; i<ccbInput.length; i++){
                if (ccbInput[i].checked){
                    let temp = document.querySelector<HTMLInputElement>('.cb_it' + i);
                    if(temp && temp.textContent){
                        IVehicle.push(temp.textContent);
                    }

                }
            }
            console.log(IVehicle);
            const instance: ICompanyFleet = {name, IVehicle};
            const response = await axios.post<ICompanyFleet[]>(`http://${process.env.REACT_APP_IP}:3001/company/add`, instance);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

const addVehicle = async (model: string, brand: string, cost: number) => {
    try {
        const instance: IVehicle = { model, brand, cost};
        const response = await axios.post<IVehicle>(`http://${process.env.REACT_APP_IP}:3001/vehicle/add`, instance);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

function Form(props: TableCoProps) {
    const [model, setModel] = useState<string>();
    const [brand, setBrand] = useState<string>();
    const [cost, setCost] = useState<number>();
    const [idVehicle, setIdVehicle] = useState<string>();
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [checkedItems, setCheckedItems] = React.useState([false, false])
    useEffect(() => {
        if (props.type === 'company') {
            const fetchData = async () => {
                try {
                    const data = await getVehicle();
                    setVehicles(data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données :', error);
                }
            };
            fetchData();
        } else {
        }
    }, [props.type]);
    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModel(e.target.value);
    };

    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrand(e.target.value);
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCost(Number(e.target.value));
    };

    const handleSubmit = async () => {
        try {
            if(model && cost && brand){

                    await addVehicle(model, brand, cost);

            }
            // Clear form fields after successful addition
            setModel("");
            setBrand("");
            setCost(0);
            setIdVehicle("");
        } catch (error) {
            console.error('Erreur lors de l\'ajout du véhicule :', error);
        }
    };

    const options = vehicles.map(vehicle => ({
        value: "_id" in vehicle ? vehicle._id : null,
        label: `${vehicle.brand} ${vehicle.model}`
    }));

    return (
        <>
        {props.type === "company" ?
            <div style={{width: "400px", marginTop: "70px"}}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input className={"company_name_i"} placeholder='Name'/>
                </FormControl>
                <div style={{marginTop: "10px"}} className="radio-con">
                    <Stack pl={6} mt={1} spacing={1}>
                        {options.map((option, key) => (
                            <div>
                                <input type="checkbox" className={"cb"} id={key.toString()} name=""/>
                                <p className={"cb_it" + key}>{option.label}</p>
                            </div>
                        ))}
                    </Stack>
                </div>
                <Button style={{marginTop: "10px"}} colorScheme='blue' onClick={() => {addCompany()}}>Add</Button>
            </div>
            :
            <div style={{display: "flex" , gap:"30px"}}>
            <div style={{width: "400px", marginTop: "70px"}}>
        <FormControl isRequired>
            <FormLabel>Model</FormLabel>
            <Input placeholder='Model' value={model} onChange={handleModelChange}/>
        </FormControl>

        <FormControl isRequired>
            <FormLabel>Brand</FormLabel>
            <Input placeholder='Brand' value={brand} onChange={handleBrandChange}/>
        </FormControl>

        <FormControl isRequired>
            <FormLabel>Cost</FormLabel>
            <Input placeholder='Cost' value={cost ? cost.toString(): ""} onChange={handleCostChange}/>
        </FormControl>

        <Button style={{marginTop: "10px"}} colorScheme='blue' onClick={() => handleSubmit()}>Add</Button>
        </div>

            </div>
}
</>
)
    ;
}

export default Form;
