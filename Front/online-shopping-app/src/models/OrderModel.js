import OrderItemModel from "./OrderItemModel";

const OrderModel = ({
    id: -1,
    name: "",
    lastName: "",
    address: "",
    totalAmount: -1,
    timeOfMakingOrder: "",
    timeOfDelivery: "",
    orderStatus: "",
    comment: "",
    orderItems: [OrderItemModel]
})

export default OrderModel;