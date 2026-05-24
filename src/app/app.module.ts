import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import standalone components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { CreatePropertyComponent } from './components/create-property/create-property.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UserPropertiesComponent } from './components/user-properties/user-properties.component';
import { SearchPropertiesComponent } from './components/search-properties/search-properties.component';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
        // Standalone components
        NavbarComponent,
        FooterComponent,
        HomeComponent,
        PropertyListComponent,
        PropertyDetailComponent,
        CreatePropertyComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        UserPropertiesComponent,
        SearchPropertiesComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
