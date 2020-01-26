import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as tmImage from '@teachablemachine/image';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  url = 'http://127.0.0.1:3000/';
  model;
  predictions;
  webcam;
  maxPredictions;
  @ViewChild('video', { static: false }) video: ElementRef;

  // tslint:disable-next-line:use-lifecycle-interface
  async ngAfterViewInit() {
    const modelURL = this.url + 'model.json';
    const metadataURL = this.url + 'metadata.json';
    this.model = await tmImage.load(modelURL, metadataURL);
    this.maxPredictions = this.model.getTotalClasses();
    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam 
    this.webcam = new tmImage.Webcam(200, 200, flip);
    await this.webcam.setup(); // request access to the webcam
    await this.webcam.play();
    requestAnimationFrame(() =>
      this.loop()
    );
    this.video.nativeElement.appendChild(this.webcam.canvas);
  }

  async loop() {
    this.webcam.update(); // update the webcam frame
    this.predictions = await this.model.predict(this.webcam.canvas, true);
    requestAnimationFrame(() =>
      this.loop()
    );
  }
}