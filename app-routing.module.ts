import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DishDetailComponent } from './dish-detail/dish-detail.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'aboutus', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'dishDetail/:id', component: DishDetailComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
