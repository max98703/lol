export const publicRoutes = [
    { 
        name: "Login", 
        component: require("../screens/Login").default
     },
    { 
        name: "SignUp", 
        component: require("../screens/SignUp").default, 
        options: { 
            animation: "slide_from_bottom"
         } },
  ];
  
  export const privateRoutes = [
    
    { 
        name: "Tab", 
        component: require("../navigators/TabNavigator").default, 
        options: { animation: "slide_from_bottom" } 
    },
    { 
        name: "Details", 
        component: require("../screens/DetailsScreen").default, 
        options: { 
            animation: "slide_from_bottom"
         } 
    },
    { 
        name: "Payment", 
        component: require("../screens/PaymentScreen").default, 
        options: { 
            animation: "slide_from_bottom"
         } 
    },
  ];