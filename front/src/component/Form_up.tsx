import React, { useEffect, useState } from 'react';
import {FormControl, FormLabel, Input, Button, Stack} from '@chakra-ui/react';
import axios from "axios";
import { ICompanyFleet, IVehicle, TableCoProps } from "../utils/types";



const updateVehicule = async (model: string, brand: string, cost: number, id: string) => {
    try {
        console.log(model);
        const instance: IVehicle = { model, brand, cost};
        await axios.put<IVehicle>(`http://${process.env.REACT_APP_IP}:3001/vehicle/update/${id}`, instance);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

const updateCompany = async () => {
    try {
        const idInput = document.querySelector<HTMLInputElement>('.id_up');
        const companyInput = document.querySelector<HTMLInputElement>('.company_name');
        if (idInput && companyInput){
            const response = await axios.get<ICompanyFleet>(`http://${process.env.REACT_APP_IP}:3001/company/getById/`+ idInput.value);
            const company: ICompanyFleet = response.data;
            company.name = companyInput.value;
            await axios.put<ICompanyFleet>(`http://${process.env.REACT_APP_IP}:3001/company/update/${idInput.value}`, company);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}


function Form(props: TableCoProps) {
    const [idVehicle, setIdVehicle] = useState<string>();
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);



    const handleSubmit = async (id: string) => {
     try{
             const modelInput = document.querySelector<HTMLInputElement>('.model_up');
             const brandInput = document.querySelector<HTMLInputElement>('.brand_up');
             const costInput = document.querySelector<HTMLInputElement>('.cost_up');
             const idInput = document.querySelector<HTMLInputElement>('.id_up');
             if (modelInput && brandInput && costInput && idInput) {
                 await updateVehicule(modelInput.value, brandInput.value, Number(costInput.value), idInput.value);
             }

            setIdVehicle("");
        } catch (error) {
            console.error('Erreur lors de l\'ajout du véhicule :', error);
        }
    };

    const options = vehicles.map(vehicle => ({
        value: "_id" in vehicle ? vehicle._id : null,
        label: `${vehicle.brand} ${vehicle.model}`
    }));

    const optionsCom = vehicles.map(vehicle => ({
        value: "_id" in vehicle ? vehicle._id : null,
        label: `${vehicle.brand} ${vehicle.model}`
    }));

    return (
        <>
            {props.type === "company" ?
                <div style={{width: "400px", marginTop: "70px"}}>
                    <div style={{width: "400px", marginTop: "70px"}}>
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input className="company_name" placeholder='Name'/>
                        </FormControl>
                        <div style={{marginTop: "10px"}} className="radio-con">
                            <Stack pl={6} mt={1} spacing={1}>
                                {optionsCom.map((option, key) => (
                                    <div>
                                        <input type="checkbox" className={"cb"} id={key.toString()} name=""/>
                                        <p className={"cb_it" + key}>{option.label}</p>
                                    </div>
                                ))}
                            </Stack>
                        </div>
                        <FormControl isRequired>
                            <FormLabel>ID</FormLabel>
                            <Input placeholder='ID'  className="id_up" />
                        </FormControl>
                        <Button style={{marginTop: "10px"}} colorScheme='blue' onClick={() => {
                            updateCompany()
                        }}>Update</Button>
                    </div>
                </div>
                :
                <div style={{display: "flex", gap: "30px"}}>
                    <div style={{width: "400px", marginTop: "70px"}}>
                        <FormControl isRequired>
                            <FormLabel>Model</FormLabel>
                            <Input placeholder='Model' className="model_up"/>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Brand</FormLabel>
                            <Input placeholder='Brand' className="brand_up"/>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Cost</FormLabel>
                            <Input placeholder='Cost' className="cost_up"/>
                        </FormControl>

                        <FormControl isRequired>
                        <FormLabel>ID</FormLabel>
                            <Input placeholder='ID'  className="id_up" />
                        </FormControl>

                        <Button style={{marginTop: "10px"}} colorScheme='blue' onClick={() => handleSubmit(idVehicle ? idVehicle : "")}>Update</Button>
                    </div>
                </div>
            }
        </>
    )
        ;
}

export default Form;
