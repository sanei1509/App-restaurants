import React, { useState } from "react";
import { StyleSheet, View } from "react-native"
import { ListItem } from "react-native-elements";
import { map } from "lodash";

import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props) {
    const { toastRef, userInfo, setReloadUserInfo } = props;
    const [ showModal, setShowModal ] = useState(false);
    const [renderComponent ,setRenderComponent] = useState(null);
   

const selectComponent = (key) => {
        switch(key) {
            case "displayName": 
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal} 
                        toastRef={toastRef}     
                        setReloadUserInfo={setReloadUserInfo}  
                    /> 
                );
                setShowModal(true);
                    break;
                        case "email": 
                            setRenderComponent( 
                                <ChangeEmailForm 
                                    email={userInfo.email}
                                    setShowModal={setShowModal}
                                    toastRef={toastRef}
                                    setReloadUserInfo={setReloadUserInfo}
                                /> 
                            );
                            setShowModal(true);    
                            break;
                                case "password": 
                                    setRenderComponent(
                                        <ChangePasswordForm 
                                        password={userInfo.password}
                                        setShowModal={setShowModal}
                                        toastRef={toastRef}
                                        setReloadUserInfo={setReloadUserInfo}
                                        />
                                    );
                                    setShowModal(true)
                                    break;
                                    
                                    default: 
                                        setRenderComponent(false);
                                        setShowModal(false);
                                        break;      
                                            }
                                };
    const menuOptions = generateOptions(selectComponent);
    
    return(
          <View 
          style={styles.viewOptionsContainer}
          >
            {map(menuOptions, (menu, index ) => (
                 <ListItem 
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColor 
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    containerStyle={styles.menuItem}
                    onPress={menu.onPress}
                 />
            ))}

            {renderComponent &&(
              <Modal isVisible={showModal} setIsVisible={setShowModal}>
                  {renderComponent}
              </Modal>          
                            )}
            </View>

        );
    }
    function generateOptions(selectComponent) {
        return[
            {
                title: "Editar Nombre y Apellido",
                iconType: "material-community",
                iconNameLeft: "account-edit",
                iconColor: "#c1c1c1",
                iconNameRight: "chevron-right",
                iconColorRight: "#00a680",
                onPress: () => selectComponent("displayName"),
            },
            {
                title: "Cambiar correo electrónico",
                iconType: "material-community",
                iconNameLeft: "email-edit",
                iconColor: "#c1c1c1",
                iconNameRight: "chevron-right",
                iconColorRight: "#00a680",
                onPress: () => selectComponent("email"),
            },
            {
                title: "Cambiar contraseña",
                iconType: "material-community",
                iconNameLeft: "shield-lock-outline",
                iconColor: "#c1c1c1",
                iconNameRight: "chevron-right",
                iconColorRight: "#00a680",
                onPress: () => selectComponent("password"),
            }
        ];
    } 

            const styles = StyleSheet.create({
                
                viewOptionsContainer: {
                    margin:0,
                },
                menuItem: {
                    marginRight: "auto",
                    marginLeft: "auto",
                    width: "95%",
                    height: 45,
                    borderBottomWidth:1 ,
                    borderBottomColor: "#e3e3e3",
                    borderRadius: 10,
                },
            });