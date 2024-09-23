import { LoginDTO } from "~/dtos/login.dto";

type Account = {
  id: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: number;
  status: number;
};

enum Role {
  MEMBER = 0,
  STAFF = 1,
  BREEDER = 2,
  MANAGER = 3,
}

enum Status {
  ACTIVE = 1,
  INACTIVE = 0,
  VERIFIED = 2,
  UNVERIFIED = 3,
  BANNED = 4,
}

export const testAccounts: Account[] = [
  {
    id: "1",
    email: "hoangclw@gmail.com",
    phoneNumber: "098765432",
    password: "123456",
    role: Role.MANAGER,
    status: Status.VERIFIED,
  },
  {
    id: "2",
    email: "duong@gmail.com",
    phoneNumber: "076543219",
    password: "123456",
    role: Role.MEMBER,
    status: Status.VERIFIED,
  },
  {
    id: "3",
    email: "son@gmail.com",
    phoneNumber: "065432197",
    password: "123456",
    role: Role.BREEDER,
    status: Status.VERIFIED,
  },
  {
    id: "4",
    email: "staff@gmail.com",
    phoneNumber: "025432197",
    password: "123456",
    role: Role.STAFF,
    status: Status.VERIFIED,
  },
];