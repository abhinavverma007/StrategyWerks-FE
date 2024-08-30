export class Doctor {
  id: string;
  name: string;
  specialization: string;
  phoneNumber: string;
  location: string;
  rating: number;
  consultationFee: number;

  constructor(data?: Partial<Doctor>) {
    this.id = data?.id ?? '';
    this.name = data?.name ?? '';
    this.specialization = data?.specialization ?? '';
    this.phoneNumber = data?.phoneNumber ?? '';
    this.location = data?.location ?? '';
    this.rating = data?.rating ?? 0;
    this.consultationFee = data?.consultationFee ?? 0;
  }
}
