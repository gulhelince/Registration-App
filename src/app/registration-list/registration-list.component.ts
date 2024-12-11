import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from './../models/user.model'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; 

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {

  public dataSource!: MatTableDataSource<User>;
  public users!: User[];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action'];



  constructor(private api:ApiService,private dialog: MatDialog,
    private router:Router,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.api.getRegisteredUser()
    .subscribe(res=>{
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id:number){
    this.router.navigate(['update',id]);
  }

  // delete(id:number){
  //   this.confirm.showConfirm("Are you sure want to delete?",
  //     ()=>{
  //       this.api.deleteRegistered(id)
  //       .subscribe(res=>{
  //         this.snackBar.open('Enquiry Updated', 'Success', {
  //           duration: 3000,
  //           panelClass: ['snackbar-success'], // Özelleştirme için
  //         });
  //         this.getUsers();
  //        })
  //     },
  //     ()=>{
        
  //     }
  //   )
    
  // }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        // Kullanıcı onay verdiyse silme işlemini yap
        this.api.deleteRegistered(id).subscribe(
          (res) => {
            this.snackBar.open('Enquiry Deleted', 'Success', {
              duration: 3000,
              panelClass: ['snackbar-success'], // Özelleştirme için
            });
            this.getUsers(); // Kullanıcı listesini güncelle
          },
          (error) => {
            this.snackBar.open('Error deleting enquiry', 'Error', {
              duration: 3000,
              panelClass: ['snackbar-error'], // Hata durumunda snackbar özelleştirme
            });
          }
        );
      } else {
        console.log('Delete action cancelled');
      }
    });
  }


}
