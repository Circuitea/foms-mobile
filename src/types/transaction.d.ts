export interface Transaction {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentTransaction {
  id: number;

}

export interface ConsumableTransaction {
  id: number;
  quantity: number;
}

export interface ConsumableItem {
  id: number;
  name: string;
  description: string;
  location: string;
  image_path: string | null;

  type: ItemType;
}

export interface EquipmentItem {
  id: number;
  name: string;
  description: string;
  image_path: string | null;

  created_at: string;
  updated_at: string | null;

  group: EquipmentGroup;
}

export interface EquipmentGroup {
  id: number;
  name: string;

  type: ItemType;
}

export interface ItemType {
  id: number;
  name: string;
  icon: string;
}