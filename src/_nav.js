export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'cui-dashboard',
    },
    {
      name: 'Farm',
      url: '/farms',
      icon: 'icon-basket-loaded'
    },
    {
      name: 'Driver',
      url: '/drivers',
      icon: 'fa fa-truck',
      children:[
        {
          name: 'Active',
          url: '/active-drivers',
          icon: 'icon-user-following'
        },
        {
          name: 'Inactive',
          url: '/inactive-drivers',
          icon: 'icon-user-unfollow'
        },
        {
          name: 'Pending',
          url: '/pending-drivers',
          icon: 'icon-user-follow'
        }
      ]
    },
    {
      name: 'Customer',
      url: '/customers',
      icon: 'cui-people'
    },
    {
      name: 'Configuration',
      url: '/Configuration',
      icon: 'icon-wrench'
    },
    {
      name: 'Transaction',
      url: '/transaction',
      icon: 'fa fa-tasks'
    },
    {
      name: 'Setting',
      url: '/setting',
      icon: 'icon-settings'
    }
  ]
};
