import nodeCCAvenue from 'node-ccavenue';
import dotenv from 'dotenv';

dotenv.config();

const ccav = new nodeCCAvenue.Configure({
    merchant_id: process.env.CCAVENUE_MERCHANT_ID,
    working_key: process.env.CCAVENUE_WORKING_KEY,
});

export const ccavRequestHandler = async (req, res) => {
    try {
        const orderParams = {
            order_id: req.body.order_id,
            currency: 'INR',
            amount: req.body.amount,
            redirect_url: encodeURIComponent(`http://${req.headers.host}/api/ccavenue/response`),
            cancel_url: encodeURIComponent(`http://${req.headers.host}/api/ccavenue/response`),
            billing_name: req.body.billing_name,
            billing_address: req.body.billing_address,
            billing_city: req.body.billing_city,
            billing_state: req.body.billing_state,
            billing_zip: req.body.billing_zip,
            billing_country: req.body.billing_country,
            billing_tel: req.body.billing_tel,
            billing_email: req.body.billing_email,
        };

        const encryptedOrderData = ccav.getEncryptedOrder(orderParams);

        res.json({ encryptedOrderData, access_code: process.env.CCAVENUE_ACCESS_CODE });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error processing payment request' });
    }
}

export const ccavResponseHandler = async (req, res) => {
    try {
        const { encResp } = req.body;
        const decryptedJsonResponse = ccav.redirectResponseToJson(encResp);
        const { order_status } = decryptedJsonResponse;

        // Based on the order_status, you can update your database and redirect the user to a success or failure page.
        if (order_status === 'Success') {
            // Payment successful
            // Here you can update your database with the order details
            res.redirect('/payment-success'); // Redirect to a success page on your frontend
        } else {
            // Payment failed
            res.redirect('/payment-failure'); // Redirect to a failure page on your frontend
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error processing payment response' });
    }
}
