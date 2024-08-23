import Razorpay from "razorpay";
import crypto from 'crypto';

const instance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID as string,
    key_secret:process.env.RAZORPAY_KEY_SECRET as string
})

export interface IRazorder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: null;
    status: string;
    attempts: number;
    notes: string[];
    created_at: number;
  }
export const createRazorpayOrder=( id: string, amount: number )=>{
    return new Promise((resolve, reject) => {
        const options = {
          amount: amount * 100, // Amount in paise (1 INR = 100 paise)
          currency: "INR", // Currency code
          receipt: id.toString(), // Unique receipt ID
}
    instance.orders.create(options,function(err,order){
        if(err){
            reject(err)
        } 
        resolve(order) 
    })

    })}

    export const verifyRazorpayPayment = (
        order_id: string,
        payment_id: string,
        signature: string
      ) => {
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest("hex");
        return generatedSignature === signature;
      };