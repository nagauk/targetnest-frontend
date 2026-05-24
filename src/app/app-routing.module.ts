import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { CreatePropertyComponent } from './components/create-property/create-property.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UserPropertiesComponent } from './components/user-properties/user-properties.component';
import { SearchPropertiesComponent } from './components/search-properties/search-properties.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'properties', component: PropertyListComponent },
  { path: 'properties/for-sale', component: PropertyListComponent, data: { listingType: 'SALE' } },
  { path: 'properties/for-rent', component: PropertyListComponent, data: { listingType: 'RENT' } },
  { path: 'properties/:id', component: PropertyDetailComponent },
  { path: 'search', component: SearchPropertiesComponent },
  { path: 'create-property', component: CreatePropertyComponent },
  { path: 'my-properties', component: UserPropertiesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
