import { ChangeDetectionStrategy, Component} from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'My Standalone Angular App';
}

