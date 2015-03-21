/*
 * Copyright 2008 Louis P. Santillan <lpsantil@gmail.com>. All rights
 *    reserved. 
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met: 
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer. 
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution. 
 *
 * THIS SOFTWARE IS PROVIDED BY LOUIS P. SANTILLAN ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL LOUIS P.
 * SANTILLAN OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

importPackage( java.io );
importPackage( java.net );
importPackage( java.util );
importPackage( java.lang );

main();

function main()
{
   // Set the port number.
   var port = 8080;

   // Establish the listening socket.
   var httpPort = null;

   try
   {
      httpPort = new ServerSocket( port );
   }
   catch( e )
   {
      System.out.println( "Could not open port " + port +
                          " for listening.\n\n" + e );
   }

   System.out.println( "\n" +
                       "Waiting on port " + port + ".\n" );

   // Process HTTP service requests in an infinite loop.
   while( true )
   {
      // Listen for a TCP connection request.
      var httpSocket = null;

      try
      {
         httpSocket = httpPort.accept();
      }
      catch( e )
      {
         System.out.println( "Could not accept socket connection\n\n" +
                             e );
      }

      // Construct an object to process the HTTP request message.
      var request = new HTTPConnectionRequest( httpSocket );

      // Create a new thread to process the request.
      var childThread = new Thread( request );

      // Start the thread.
      childThread.start();
   }
}

function HTTPConnectionRequest( parentSocket )
{
   return( new java.lang.Runnable()
   {
      threadedSocket: parentSocket,
      timeStart: 0,
      timeEnd: 0,
      byteCount: 0,

      // Implement the run() method of the Runnable interface.
      run: function()
      {
         this.timeStart = Date.now();
         try
         {
            this.processRequest();
         }
         catch( e )
         {
            System.out.println( "Could not process HTTP Request.\n\n" + e );
         }
      },

      processRequest: function()
      {
         // Get a reference to the socket's input and output streams.
         var inStream =
            new InputStreamReader( this.threadedSocket.getInputStream() );
         var outStream =
            new DataOutputStream( this.threadedSocket.getOutputStream() );

         // Set up input stream filters.
         var buffer = new BufferedReader( inStream );

         // Get the request line of the HTTP request message.
         var requestLine = buffer.readLine();

         // Get header lines.
         var headerLine = null,
             statusLine = null,
             contentTypeLine = null,
             httpResponse = null;

         while( ( headerLine = buffer.readLine() ).length() != 0 )
         {
            // Skip header messages
            // **********************************************************
            // ***FIX ME-Needs to be fixed to support QueryString and ***
            // ***POST method                                         ***
            // **********************************************************
         }

         // Extract the parts of the HTTP Request
         var tok = new StringTokenizer( requestLine );
         var fName = null;

         // Display Parsed HTTP Request
         System.out.println( "--- ---\n" +
                             "Method: " + tok.nextToken() + "\n" +
                             "Resource: " + ( fName = tok.nextToken() ) + "\n" +
                             "Protocol: " + tok.nextToken() + "\n" +
/*                             "Time: " + timeDiff + "\n" +
                             "Bytes: " + timeDiff + "\n" +
                             "Bytes/Sec: " + timeDiff + "\n" +*/
                             "" );

         // Prepare file input stream to read the requested file
         var fileRes = null;
         var fileExists = true;

         fName = "." + fName;

         // Attempt to open requested file
         try
         {
            fileRes = new FileInputStream( fName );
         }
         catch( e )
         {
            fileExists = false;

            System.out.println( "404 Error" );
         }

         // If we were able to open the file...
         if( fileExists )
         {
            // ...say so
            statusLine = "HTTP/1.0 200 OK\n";
         }
         else
         {
            // ...otherwise say File Not Found...
            statusLine = "HTTP/1.0 404 Not Found\n";

            // ...and send the placeholder file
            fName = "./404.html";

            // Try to open the placeholder file
            try
            {
               fileRes = new FileInputStream( fName );
            }
            catch( e )
            {
               System.out.println( "Buh...You suck!\n" );
            }
         }

         // Figure out what type of file we are sending back
         contentTypeLine = "Content-type: " +
                           this.determineContentType( fName ) + "\n\n";

         // Tell the requester the response and file type of the
         //    file we are sending
         outStream.writeBytes( statusLine + contentTypeLine );

         // Send back a file
         this.sendFile( fileRes, outStream );

         // Close streams and socket.
         fileRes.close();
         outStream.close();
         buffer.close();
         this.threadedSocket.close();
         this.timeEnd = Date.now();
         
         var t = this.timeEnd - this.timeStart;
         var bs = this.byteCount / ( t / 1000.0 ) / 1024;
         System.out.println( "Time: " + t + "ms\n" +
                             "Bytes: " + this.byteCount + "\n" +
                             "KB/Sec: " + bs + "\n" );

      },

      determineContentType: function( ff )
      {
         var f = new java.lang.String( ff );

         // If we are sending back an HTML file...
         if( f.endsWith( ".htm" ) ||
             f.endsWith( ".html" ) )
         {
            return( "text/html" );
         }
         // If we are sending back a GIF file...
         else if( f.endsWith( ".gif" ) )
         {
            return( "image/gif" );
         }
         // If we are sending back a PNG file...
         else if( f.endsWith( ".png" ) )
         {
            return( "image/png" );
         }
         // If we are sending back a JPEG file...
         else if( f.endsWith( ".jpg" ) ||
                  f.endsWith( ".jpeg" ) )
         {
            return( "image/jpeg" );
         }
         // If we are sending back a JPEG file...
         else if( f.endsWith( ".svg" ) )
         {
            return( "image/svg+xml" );
         }
         // If we are sending back a regular ol' text file...
         else if( f.endsWith( ".txt" ) )
         {
            return( "text/plain" );
         }

         // If we aren't sure what we are sending...
         return( "application/octet-stream" );
      },

      sendFile: function( stream, outStream )
      {
         // create a buffer to buffer our output with
         var buffer =
             java.lang.reflect.Array.newInstance(
                java.lang.Byte.TYPE, 2048 );
         var length = 0;

         // while we have something to send from the file
         while( ( length = stream.read( buffer ) ) != -1 )
         {
            outStream.write( buffer, 0, length );
            this.byteCount += length;
         }
      }
   } );
}
