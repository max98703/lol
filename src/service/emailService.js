
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

const EMAILJS_SERVICE_ID = "service_r6qpoph";
const EMAILJS_TEMPLATE_ID = "template_qilvix4";
const EMAILJS_PUBLIC_KEY = "ft7xljCFlncasHDB9";

// Function to generate a random 12-digit Order ID
const generateOrderId = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const sendOrderEmail = async (userName, userEmail, cartList, cartTotal = 100) => {
  const orderId = generateOrderId(); // Generate random Order ID
  const orderDate =
    new Date().toDateString() + " " + new Date().toLocaleTimeString();

  const generateCartItemsHTML = (cartList) => {
    if (!Array.isArray(cartList)) {
      return ''; // Return empty string if cartList is not an array
    }
    return cartList.map((item) => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; margin-top: 10px; padding: 10px; border-radius: 8px; background-color: #f8f9fa;">
            <div style="display: flex; align-items: center; flex: 1;">
                <img src="${item.imagelink_square}" alt="${item.name}" 
                    style="width: 100px; height: 100px; object-fit: contain; border-radius: 8px; margin-right: 15px; background-color: white; padding: 5px;">
                <div>
                    <p style="font-size: 16px; font-weight: bold; margin: 0; color: #121212;">${item.name}</p>
                    ${item.prices.map(p => `
                        <p style="margin: 3px 0; color:#1D3425;">
                            Size:${p.size} 
                        </p>
                        <p style="margin: 3px 0; color:#1D3425;">
                            Quantity:${p.size} 
                        </p>
                    `).join('')}
                </div>
            </div>
            <div style="display: flex; align-items: center; flex-shrink: 0; text-align: right; min-width: 400px;">
                ${item.prices.map(p => `
                    <p style="margin: 0 auto; color:#1D3425; font-weight: bold;">$${p.price}</p>
                `).join('')}
            </div>
        </div>
    `).join('');
  };

  const cartItemsHTML = generateCartItemsHTML(cartList);

  const templateParams = {
    discount: ((20 / 100) * cartTotal).toFixed(2).toString(),
    deliveryFee: 15,
    from_name: userName,
    form_name:userName,
    to_email: userEmail,
    order_id: orderId,
    order_date: orderDate,
    cart_list: cartItemsHTML, // Convert cart list to string
    cart_total: cartTotal,
    cart_sum: (cartTotal - (20 / 100) * cartTotal + 15 ).toFixed(2).toString()
  };

  try {
    const response = await send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {
            publicKey: EMAILJS_PUBLIC_KEY,
        },
    );
      
    console.log("Email sent:", response.status, response.text);
    return { success: true, orderId }; // Return Order ID for reference
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', err);
    }

    console.log('ERROR', err);
  }
};

export default sendOrderEmail;
