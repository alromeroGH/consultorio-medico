import { Component } from '@angular/core';
import { AdminRoutingModule } from "../admin/admin-routing.module";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [AdminRoutingModule]
})
export class AuthComponent {

}
