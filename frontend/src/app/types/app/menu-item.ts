export default interface MenuItem {
  id?: string;
  name: string;
  icon: string;
  route?: string;
  roles: Array<string>;
}
