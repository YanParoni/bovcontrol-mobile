import Realm from 'realm';

const FarmerSchema: Realm.ObjectSchema = {
  name: 'Farmer',
  properties: {
    name: 'string',
    city: 'string',
  },
};

const PersonSchema: Realm.ObjectSchema = {
  name: 'Person',
  properties: {
    name: 'string',
  },
};

const LocationSchema: Realm.ObjectSchema = {
  name: 'Location',
  properties: {
    latitude: 'double',
    longitude: 'double',
  },
};

export const ChecklistSchema: Realm.ObjectSchema = {
  name: 'Checklist',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    type: 'string',
    amount_of_milk_produced: 'int',
    number_of_cows_head: 'int',
    had_supervision: 'bool',
    farmer: 'Farmer',
    from: 'Person',
    to: 'Person',
    location: 'Location',
    created_at: 'date',
    updated_at: 'date',
    isPending: { type: 'bool', default: true },
  },
};

export const schemas = [
  FarmerSchema,
  PersonSchema,
  LocationSchema,
  ChecklistSchema,
];
