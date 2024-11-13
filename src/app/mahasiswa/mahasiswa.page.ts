import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;
  modalTambah: any;
  modalEdit: any;
  id: any;
  nama: any;
  jurusan: any;

  constructor(private api: ApiService, private alertController: AlertController) {}

  ngOnInit() {
    this.getMahasiswa();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  resetModal() {
    this.id = null;
    this.nama = '';
    this.jurusan = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilMahasiswa(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  cancel() {
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  tambahMahasiswa() {
    if (this.nama !== '' && this.jurusan !== '') {
      const data = {
        nama: this.nama,
        jurusan: this.jurusan,
      };
      this.api.tambah(data, 'tambah.php').subscribe({
        next: (hasil: any) => {
          this.resetModal();
          console.log('berhasil tambah mahasiswa');
          this.getMahasiswa();
          this.modalTambah = false;
        },
        error: (err: any) => {
          console.log('gagal tambah mahasiswa');
        },
      });
    } else {
      console.log('gagal tambah mahasiswa karena masih ada data yg kosong');
    }
  }

  editMahasiswa() {
    const data = {
      id: this.id,
      nama: this.nama,
      jurusan: this.jurusan,
    };
    this.api.edit(data, 'edit.php').subscribe({
      next: (hasil: any) => {
        console.log('berhasil edit Mahasiswa', hasil);
        this.resetModal();
        this.getMahasiswa();
        this.modalEdit = false;
      },
      error: (err: any) => {
        console.log('gagal edit Mahasiswa');
      },
    });
  }

  // Fungsi untuk konfirmasi hapus
  async confirmHapus(id: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Hapus',
      message: 'Apakah Anda ingin menghapus data mahasiswa?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Penghapusan dibatalkan');
          },
        },
        {
          text: 'Ya',
          handler: () => {
            this.hapusMahasiswa(id);
          },
        },
      ],
    });
    await alert.present();
  }

  hapusMahasiswa(id: any) {
    this.api.hapus(id, 'hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('berhasil hapus data', res);
        this.getMahasiswa();
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilMahasiswa(id: any) {
    this.api.lihat(id, 'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let mahasiswa = hasil;
        this.id = mahasiswa.id;
        this.nama = mahasiswa.nama;
        this.jurusan = mahasiswa.jurusan;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }
}
