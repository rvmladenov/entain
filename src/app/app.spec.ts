import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { SocketService } from '@shared/services/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MultiplayerDialogComponent } from '@shared/components/dialogs/multiplayer/multiplayer-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const socketSpy = jasmine.createSpyObj('SocketService', [
      'enableMultiplayer',
      'sendMessage',
      'onMessage',
    ]);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: SocketService, useValue: socketSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(App, {
        set: {
          providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    socketServiceSpy = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('onMultiplayer', () => {
    it('should enable multiplayer, send join message, and subscribe to messages', () => {
      component.onMultiplayer();

      expect(socketServiceSpy.enableMultiplayer).toHaveBeenCalled();
      expect(socketServiceSpy.sendMessage).toHaveBeenCalledWith({
        difficulty: 'easy',
        gameId: '123',
        userId: '123',
        message: 'joinGame',
      });
      expect(socketServiceSpy.onMessage).toHaveBeenCalled();
    });
  });

  describe('onNewGame', () => {
    it('should open dialog and handle result', () => {
      const dialogResult = { difficulty: 'medium', gameId: 'test-game-id' };
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(dialogResult), close: null });
      dialogSpy.open.and.returnValue(dialogRefSpyObj);

      spyOn(component, 'onMultiplayer');

      component.onNewGame();

      expect(dialogSpy.open).toHaveBeenCalledWith(MultiplayerDialogComponent);
      expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();

      expect(socketServiceSpy.sendMessage).toHaveBeenCalledWith({
        difficulty: 'medium',
        gameId: 'test-game-id',
        userId: '123',
        message: 'joinGame',
      });
      expect(component.onMultiplayer).toHaveBeenCalled();
    });
  });
});
