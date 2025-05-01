import Pusher from 'pusher-js';


const pusher = new Pusher('499d51c77ae90ef82e7b', {
  cluster: 'ap1',
  encrypted: true
});

// channels for different notification types
export const orderUpdatesChannel = pusher.subscribe('order-updates');
export const orderItemUpdatesChannel = pusher.subscribe('order-item-updates');
export const menuUpdatesChannel = pusher.subscribe('menu-updates');

export default pusher;